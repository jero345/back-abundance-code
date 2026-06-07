import { sb, sbAnon, throwIfError } from '../lib/supabase.js';
import { findProfileByEmail, updateProfile } from '../data/profiles.js';
import {
  findOrderByActivationCode,
  updateOrder,
} from '../data/orders.js';
import {
  findForUserOnDate,
  upsertForUserOnDate,
} from '../data/dailyActivations.js';

/* POST /api/activation/activate
   User scans QR → submits activation code + birth data + password.
   - If no Supabase user exists for the email, we create one (admin API).
   - We then sign in with the provided password to return a session.
   - We mark the order activated, link order.user_id, set profile fields. */

export const activateSphere = async (req, res, next) => {
  try {
    const { activationCode, name, email, password, birthDate, birthTime, birthPlace } = req.body;

    if (!activationCode || !email || !password || !birthDate) {
      return res.status(400).json({
        message: 'Activation code, email, password and birth date are required',
      });
    }

    const order = await findOrderByActivationCode(activationCode);
    if (!order)                       return res.status(404).json({ message: 'Invalid activation code' });
    if (order.is_activated)           return res.status(409).json({ message: 'This sphere has already been activated' });
    if (order.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ message: 'Email does not match order' });
    }

    // 1) Find or create the Supabase auth user
    let profile = await findProfileByEmail(email);
    if (!profile) {
      const { data: created, error: createErr } = await sb.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // skip confirmation for now
        user_metadata: { name: name || order.name || '' },
      });
      if (createErr) return res.status(400).json({ message: createErr.message });
      // Trigger handle_new_user() inserts the profile row; re-fetch
      profile = await findProfileByEmail(email);
    }

    // 2) Persist activation + birth fields on the profile
    const now      = new Date();
    const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    profile = await updateProfile(profile.id, {
      name:                  name || profile.name,
      birth_date:            birthDate,
      birth_time:            birthTime,
      birth_place:           birthPlace,
      is_activated:          true,
      activation_code:       activationCode,
      activated_at:          now.toISOString(),
      subscription_status:   'trial',
      trial_start_date:      now.toISOString(),
      trial_end_date:        trialEnd.toISOString(),
    });

    // 3) Mark order as activated and link the user
    await updateOrder(order.id, {
      is_activated: true,
      user_id:      profile.id,
    });

    // 4) Issue a session so the frontend can log in immediately
    const { data: session, error: signInErr } =
      await sbAnon.auth.signInWithPassword({ email, password });
    if (signInErr) {
      return res.status(201).json({
        message: 'Sphere activated. Please sign in with your password.',
        token:   null,
        user: {
          id: profile.id, email: profile.email, name: profile.name,
          isActivated: true, subscriptionStatus: 'trial',
          trialEndDate: profile.trial_end_date,
        },
      });
    }

    res.status(201).json({
      message: 'Sphere activated successfully. Your 30-day portal access begins now.',
      token:        session.session.access_token,
      refreshToken: session.session.refresh_token,
      user: {
        id:                 profile.id,
        email:              profile.email,
        name:               profile.name,
        isActivated:        true,
        subscriptionStatus: profile.subscription_status,
        trialEndDate:       profile.trial_end_date,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* GET /api/activation/daily
   Today's activation for the authenticated user. Generates on-demand. */

export const getDailyActivation = async (req, res, next) => {
  try {
    const today = new Date();
    const dateISO = today.toISOString().slice(0, 10); // yyyy-mm-dd

    let activation = await findForUserOnDate(req.user.id, dateISO);
    if (!activation) {
      activation = await generateDailyActivation(req.user, dateISO, today);
    }

    // Premium fields hidden unless subscription is active
    const isPremium = req.user.subscription_status === 'active';
    if (!isPremium) {
      delete activation.full_activation;
      activation.planetary_alerts = [];
    }

    res.json(activation);
  } catch (err) {
    next(err);
  }
};

async function generateDailyActivation(user, dateISO, date) {
  // Simplified deterministic generator — in production wire to an astrology API
  const frequencies = ['111','222','333','444','555','666','777','888','999'];
  const planets     = ['Jupiter','Venus','Mercury','Mars','Saturn','Moon','Sun'];
  const houses      = ['House 1','House 2','House 4','House 7','House 8','House 10','House 11'];
  const energies    = [
    'Financial expansion energy',
    'Creative abundance flow',
    'Clarity and decision alignment',
    'Magnetic attraction cycle',
    'Deep transformation window',
    'Connection and opportunity energy',
    'Success and recognition vibration',
  ];

  const idx = (date.getDate() + date.getMonth()) % frequencies.length;
  const planetIdx = idx % planets.length;

  return upsertForUserOnDate({
    user_id:             user.id,
    date:                dateISO,
    frequency:           frequencies[idx],
    planetary_influence: `${planets[planetIdx]} – ${houses[planetIdx]}`,
    energy_type:         energies[planetIdx],
    daily_message:       `Today your energy aligns with ${energies[planetIdx].toLowerCase()}. Trust the patterns unfolding around you.`,
    ritual:              'Hold your sphere for 3 minutes. Breathe deeply. Set your intention for the day.',
    opportunity_windows: [
      { time: '08:00 – 10:00', description: 'High focus window for strategic decisions' },
      { time: '14:00 – 16:00', description: 'Creative and financial alignment peak' },
    ],
    full_activation:     'Full premium activation content goes here...',
    planetary_alerts:    [{ planet: planets[planetIdx], house: houses[planetIdx], description: energies[planetIdx] }],
  });
}

import { sb, sbAnon, throwIfError } from '../lib/supabase.js';
import { findProfileByEmail, updateProfile } from '../data/profiles.js';

/* =============================================================================
 *  Auth endpoints — thin wrappers over Supabase Auth.
 *  The frontend can either:
 *    (a) call these endpoints (back-compat), or
 *    (b) call supabase.auth.* directly from @supabase/supabase-js
 *  Both flows return the same access_token, which our protect() middleware
 *  accepts as Authorization: Bearer <token>.
 * ============================================================================*/

// POST /api/users/register
export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const existing = await findProfileByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // signUp triggers handle_new_user() → row in public.profiles
    const { data, error } = await sbAnon.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // If email confirmation is enabled in Supabase, session will be null.
    const session = data.session;
    const user    = data.user;

    res.status(201).json({
      token: session?.access_token || null,
      refreshToken: session?.refresh_token || null,
      requiresEmailConfirmation: !session,
      user: { id: user?.id, email: user?.email, name },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const { data, error } = await sbAnon.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const profile = await findProfileByEmail(email);

    res.json({
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || null,
        isActivated: profile?.is_activated || false,
        subscriptionStatus: profile?.subscription_status || 'none',
        isAdmin: profile?.is_admin || false,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/logout — best-effort; the frontend should also drop the token
export const logout = async (req, res, next) => {
  try {
    if (req.token) {
      // Revokes the user's refresh tokens server-side.
      await sb.auth.admin.signOut(req.token).catch(() => {});
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/me
export const getMe = async (req, res) => {
  const u = req.user;
  res.json({
    id: u.id,
    email: u.email,
    name: u.name,
    birthDate: u.birth_date,
    birthTime: u.birth_time,
    birthPlace: u.birth_place,
    isActivated: u.is_activated,
    subscriptionStatus: u.subscription_status,
    trialEndDate: u.trial_end_date,
    isAdmin: u.is_admin,
  });
};

// PATCH /api/users/profile
export const updateProfileCtrl = async (req, res, next) => {
  try {
    const { name, birthDate, birthTime, birthPlace } = req.body;
    const patch = {};
    if (name !== undefined)       patch.name        = name;
    if (birthDate !== undefined)  patch.birth_date  = birthDate;
    if (birthTime !== undefined)  patch.birth_time  = birthTime;
    if (birthPlace !== undefined) patch.birth_place = birthPlace;

    const updated = await updateProfile(req.user.id, patch);
    res.json({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      birthDate: updated.birth_date,
      birthTime: updated.birth_time,
      birthPlace: updated.birth_place,
    });
  } catch (err) {
    next(err);
  }
};

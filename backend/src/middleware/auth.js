import { sb } from '../lib/supabase.js';
import { findProfileById } from '../data/profiles.js';

/* =============================================================================
 *  Auth middleware (Supabase JWT)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The frontend obtains a session via supabase.auth.signUp / signInWithPassword
 *  and sends the access_token as `Authorization: Bearer <token>` on protected
 *  requests. We verify it against Supabase and load the profile row.
 *
 *  After this middleware runs:
 *     req.authUser → Supabase auth user (id, email, ...)
 *     req.user     → row from public.profiles (camelCase-ish via DB)
 *     req.token    → raw access token (for sbAsUser() if RLS is needed)
 * ============================================================================*/

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data, error } = await sb.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }

    const profile = await findProfileById(data.user.id);
    if (!profile) {
      return res.status(401).json({ message: 'Profile not found' });
    }

    req.authUser = data.user;
    req.user     = profile;
    req.token    = token;
    next();
  } catch (err) {
    console.error('[auth.protect]', err);
    res.status(401).json({ message: 'Not authorized' });
  }
};

export const requireActivation = (req, res, next) => {
  if (!req.user?.is_activated) {
    return res.status(403).json({ message: 'Sphere not activated yet' });
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const requireSubscription = (req, res, next) => {
  const { subscription_status: status, trial_end_date: trialEnd } = req.user || {};
  const now = new Date();

  if (status === 'trial' && trialEnd && new Date(trialEnd) > now) return next();
  if (status === 'active') return next();

  return res
    .status(403)
    .json({ message: 'Active subscription required', code: 'SUBSCRIPTION_REQUIRED' });
};

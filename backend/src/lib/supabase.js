import { createClient } from '@supabase/supabase-js';

/* =============================================================================
 *  Supabase clients
 *  - sb       → service-role client (bypasses RLS). Use from server-only code.
 *  - sbAsUser → returns a client scoped to a user's JWT (respects RLS).
 *               Only use when you want RLS to enforce ownership.
 * ============================================================================*/

const SUPABASE_URL          = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON         = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.warn(
    '[supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.\n' +
    '           Backend DB calls will fail until you set them in backend/.env.'
  );
}

export const sb = createClient(
  SUPABASE_URL || 'http://localhost',
  SUPABASE_SERVICE_ROLE || 'placeholder',
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

/* Anonymous client — for password-based signUp / signInWithPassword from the
 * server (those flows require the anon key, not service_role). */
export const sbAnon = createClient(
  SUPABASE_URL || 'http://localhost',
  SUPABASE_ANON || 'placeholder',
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

/**
 * Build a Supabase client that acts as the given user (RLS-enforced).
 * Pass the raw Bearer token from `Authorization: Bearer <token>`.
 */
export function sbAsUser(jwt) {
  return createClient(
    SUPABASE_URL || 'http://localhost',
    SUPABASE_ANON || 'placeholder',
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    }
  );
}

/**
 * Throw an Error with statusCode if the Supabase response carries an error.
 * Use after every query: `const { data, error } = await sb...; throwIfError(error)`.
 */
export function throwIfError(error, fallbackStatus = 500) {
  if (!error) return;
  const err = new Error(error.message || 'Supabase error');
  err.statusCode = error.status || fallbackStatus;
  err.code       = error.code;
  throw err;
}

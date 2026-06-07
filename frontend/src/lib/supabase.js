import { createClient } from '@supabase/supabase-js';

/* =============================================================================
 *  Supabase client (browser)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Set these in frontend/.env (Vite picks up VITE_* prefix at build time):
 *      VITE_SUPABASE_URL=...
 *      VITE_SUPABASE_ANON_KEY=...
 *
 *  Two ways to use this client:
 *    (a) auth flows: supabase.auth.signInWithPassword / signUp / signOut
 *    (b) anywhere you need the JWT to attach to your backend:
 *           const { data: { session } } = await supabase.auth.getSession();
 *           fetch('/api/orders/my', {
 *             headers: { Authorization: `Bearer ${session.access_token}` }
 *           });
 * ============================================================================*/

const URL  = import.meta.env.VITE_SUPABASE_URL;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!URL || !ANON) {
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.\n' +
    '           Auth and any direct Supabase queries will fail until set.'
  );
}

export const supabase = createClient(
  URL  || 'http://localhost',
  ANON || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'ac_supabase_session',
    },
  }
);

/* Helper: get a fresh access token for backend requests. Returns null when
 * the user is signed out. The Supabase client auto-refreshes if expired. */
export async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/* Helper: fetch wrapper that always attaches the access token if present.
 * Use this for calls to your Express backend. */
export async function authFetch(input, init = {}) {
  const token = await getAccessToken();
  const headers = {
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(input, { ...init, headers });
}

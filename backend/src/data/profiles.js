import { sb, throwIfError } from '../lib/supabase.js';

/* Profiles = the public.profiles table that mirrors auth.users.
 * A row is auto-created by the on_auth_user_created trigger, so we
 * never INSERT a fresh profile from the server. We only update / read. */

export async function findProfileById(id) {
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function findProfileByEmail(email) {
  if (!email) return null;
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .ilike('email', email)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function findProfileByStripeCustomer(customerId) {
  if (!customerId) return null;
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function updateProfile(id, patch) {
  const { data, error } = await sb
    .from('profiles')
    .update(patch)
    .eq('id', id)
    .select('*')
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function listProfiles({ search = '', page = 1, limit = 20 } = {}) {
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let q = sb
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('is_admin', false)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search) {
    q = q.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
  }

  const { data, error, count } = await q;
  throwIfError(error);
  return { users: data || [], total: count || 0, page, pages: Math.ceil((count || 0) / limit) };
}

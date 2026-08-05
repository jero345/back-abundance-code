import { sb, throwIfError } from '../lib/supabase.js';

const SUB_COLS = `
  id, email, name,
  stripe_customer_id, stripe_subscription_id, stripe_session_id,
  plan, price_cents, currency,
  status, current_period_end, source,
  access_token, access_code, token_expires_at, redeemed_at, app_user_id,
  utm_campaign, reminders_sent, last_reminder_at,
  created_at, updated_at
`;

/* ── Lookups ─────────────────────────────────────────────────────────────── */

export async function findBySession(stripeSessionId) {
  const { data, error } = await sb
    .from('subscriptions')
    .select(SUB_COLS)
    .eq('stripe_session_id', stripeSessionId)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function findByToken(token) {
  const { data, error } = await sb
    .from('subscriptions')
    .select(SUB_COLS)
    .eq('access_token', token)
    .maybeSingle();
  throwIfError(error);
  return data;
}

/* El email es la llave del sistema. Se guarda siempre en minúsculas (ver
 * upsertByEmail), así que aquí basta con normalizar la búsqueda igual.
 *
 * Se usa `eq` y no `ilike` a propósito: en ilike, `_` y `%` son comodines, y
 * el guion bajo es legal en un correo — `john_doe@x.com` acabaría casando con
 * `johnXdoe@x.com`. */
export async function findByEmail(email) {
  const { data, error } = await sb
    .from('subscriptions')
    .select(SUB_COLS)
    .eq('email', (email || '').trim().toLowerCase())
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function findByStripeSubscription(subscriptionId) {
  const { data, error } = await sb
    .from('subscriptions')
    .select(SUB_COLS)
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function findByStripeCustomer(customerId) {
  const { data, error } = await sb
    .from('subscriptions')
    .select(SUB_COLS)
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  throwIfError(error);
  return data;
}

/* ── Escritura ───────────────────────────────────────────────────────────── */

/* Alta o actualización por email: si alguien vuelve a suscribirse tras
 * cancelar, se reutiliza su fila y conserva su historial.
 *
 * Se busca y luego se escribe, en vez de usar `upsert`. Motivo: `upsert` exige
 * un índice único sobre la columna `email`, y la base puede tenerlo sobre
 * `lower(email)` — Postgres no acepta un índice de expresión en un ON CONFLICT
 * y revienta con "no unique or exclusion constraint matching". Así funciona con
 * cualquiera de los dos.
 *
 * La carrera entre dos webhooks simultáneos del mismo correo la sigue cubriendo
 * el índice único: el segundo INSERT falla, Stripe reintenta, y en el reintento
 * ya encuentra la fila. */
export async function upsertByEmail(fields) {
  const email = (fields.email || '').trim().toLowerCase();
  const payload = { ...fields, email };

  const existing = await findByEmail(email);

  if (existing) {
    return updateById(existing.id, payload);
  }

  const { data, error } = await sb
    .from('subscriptions')
    .insert(payload)
    .select(SUB_COLS)
    .single();
  throwIfError(error);
  return data;
}

export async function updateById(id, fields) {
  const { data, error } = await sb
    .from('subscriptions')
    .update(fields)
    .eq('id', id)
    .select(SUB_COLS)
    .single();
  throwIfError(error);
  return data;
}

/* Suscripciones pagadas que nadie ha canjeado todavía — para los recordatorios. */
export async function findUnredeemed({ olderThanHours = 24, maxReminders = 2 } = {}) {
  const cutoff = new Date(Date.now() - olderThanHours * 3600 * 1000).toISOString();
  const { data, error } = await sb
    .from('subscriptions')
    .select(SUB_COLS)
    .is('redeemed_at', null)
    .eq('status', 'active')
    .lt('created_at', cutoff)
    .lt('reminders_sent', maxReminders);
  throwIfError(error);
  return data || [];
}

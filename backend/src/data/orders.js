import { sb, throwIfError } from '../lib/supabase.js';

const ORDER_COLS = `
  id, email, name, phone,
  address_line1, address_line2, address_city, address_state, address_postal_code, address_country,
  product_name, product_type, product_includes_bracelet, product_price_cents, product_currency,
  stripe_session_id, stripe_payment_intent_id,
  status, tracking_number, shipped_at, delivered_at, notes,
  activation_code, qr_code_url, is_activated, user_id,
  created_at, updated_at
`;

/* ── Lookups ─────────────────────────────────────────────────────────────── */

export async function findOrderBySession(stripeSessionId) {
  const { data, error } = await sb
    .from('orders')
    .select(ORDER_COLS)
    .eq('stripe_session_id', stripeSessionId)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function findOrderByActivationCode(code) {
  const { data, error } = await sb
    .from('orders')
    .select(ORDER_COLS)
    .eq('activation_code', code)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function findOrderById(id) {
  const { data, error } = await sb
    .from('orders')
    .select(ORDER_COLS)
    .eq('id', id)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function findOrdersByUser(userId) {
  const { data, error } = await sb
    .from('orders')
    .select(ORDER_COLS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  throwIfError(error);
  return data || [];
}

/* ── Writes ──────────────────────────────────────────────────────────────── */

export async function createOrder(payload) {
  const { data, error } = await sb
    .from('orders')
    .insert(payload)
    .select(ORDER_COLS)
    .single();
  throwIfError(error);
  return data;
}

export async function updateOrder(id, patch) {
  const { data, error } = await sb
    .from('orders')
    .update(patch)
    .eq('id', id)
    .select(ORDER_COLS)
    .maybeSingle();
  throwIfError(error);
  return data;
}

/* ── Admin listing ───────────────────────────────────────────────────────── */

export async function listOrders({ status, search, page = 1, limit = 20 } = {}) {
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let q = sb
    .from('orders')
    .select(ORDER_COLS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status && status !== 'all') q = q.eq('status', status);
  if (search) {
    q = q.or(
      `email.ilike.%${search}%,name.ilike.%${search}%,activation_code.ilike.%${search}%`
    );
  }

  const { data, error, count } = await q;
  throwIfError(error);
  return { orders: data || [], total: count || 0, page, pages: Math.ceil((count || 0) / limit) };
}

/* ── Stats (replaces Mongo aggregate) ─────────────────────────────────────── */

export async function getOrderStats() {
  // group by status
  const { data: byStatusRows, error: e1 } = await sb
    .from('orders')
    .select('status');
  throwIfError(e1);

  const byStatus = {};
  let totalOrders = 0;
  (byStatusRows || []).forEach(r => {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    totalOrders++;
  });

  // revenue (all-time) — paid through delivered
  const PAID_STATUSES = ['paid','processing','shipped','delivered'];
  const { data: revRows, error: e2 } = await sb
    .from('orders')
    .select('product_price_cents, created_at, status')
    .in('status', PAID_STATUSES);
  throwIfError(e2);

  const thirty = Date.now() - 30 * 24 * 60 * 60 * 1000;
  let totalRevenue = 0, revenueLastMonth = 0;
  (revRows || []).forEach(r => {
    totalRevenue += r.product_price_cents || 0;
    if (new Date(r.created_at).getTime() >= thirty) {
      revenueLastMonth += r.product_price_cents || 0;
    }
  });

  return { totalOrders, totalRevenue, revenueLastMonth, byStatus };
}

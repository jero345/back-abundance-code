import { sb, throwIfError } from '../lib/supabase.js';

const COLS = `
  id, user_id, date,
  frequency, planetary_influence, energy_type, daily_message, ritual,
  opportunity_windows, full_activation, planetary_alerts,
  is_premium, is_read, created_at, updated_at
`;

export async function findForUserOnDate(userId, dateISO /* yyyy-mm-dd */) {
  const { data, error } = await sb
    .from('daily_activations')
    .select(COLS)
    .eq('user_id', userId)
    .eq('date', dateISO)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function upsertForUserOnDate(payload) {
  const { data, error } = await sb
    .from('daily_activations')
    .upsert(payload, { onConflict: 'user_id,date' })
    .select(COLS)
    .single();
  throwIfError(error);
  return data;
}

export async function markRead(id) {
  const { error } = await sb
    .from('daily_activations')
    .update({ is_read: true })
    .eq('id', id);
  throwIfError(error);
}

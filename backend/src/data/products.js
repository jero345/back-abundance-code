import { sb, throwIfError } from '../lib/supabase.js';

const COLS = 'id, name, description, price_cents, currency, image_url, is_active, slug, wc_product_id, created_at, updated_at';

export async function listProducts() {
  const { data, error } = await sb
    .from('products')
    .select(COLS)
    .order('created_at', { ascending: false });
  throwIfError(error);
  return data || [];
}

export async function findProductById(id) {
  const { data, error } = await sb
    .from('products')
    .select(COLS)
    .eq('id', id)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function createProduct(payload) {
  const { data, error } = await sb
    .from('products')
    .insert(payload)
    .select(COLS)
    .single();
  throwIfError(error);
  return data;
}

export async function updateProduct(id, patch) {
  const { data, error } = await sb
    .from('products')
    .update(patch)
    .eq('id', id)
    .select(COLS)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function deleteProduct(id) {
  const { error } = await sb
    .from('products')
    .delete()
    .eq('id', id);
  throwIfError(error);
}

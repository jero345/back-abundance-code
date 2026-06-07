import { sb, throwIfError } from '../lib/supabase.js';

/**
 * POST /api/webhooks/woocommerce
 * Receives WooCommerce product.created / product.updated / product.deleted
 * webhooks and syncs them to public.products in Supabase.
 *
 * The `wc_product_id` column is the natural key for upsert.
 */
export const handleWcWebhook = async (req, res, next) => {
  try {
    const event = req.headers['x-wc-webhook-topic'];

    // WooCommerce sends a form-encoded ping on webhook save — just acknowledge
    const rawStr = Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body);
    if (!event || rawStr.startsWith('webhook_id=')) {
      return res.json({ received: true });
    }

    let data;
    try { data = JSON.parse(rawStr); }
    catch { return res.json({ received: true }); }

    if (!event?.startsWith('product.')) {
      return res.json({ received: true });
    }

    // ── DELETE ────────────────────────────────────────────────────────────
    if (event === 'product.deleted') {
      const { error } = await sb
        .from('products')
        .update({ is_active: false })
        .eq('wc_product_id', data.id);
      throwIfError(error);
      console.log(`[WC Webhook] Product #${data.id} deactivated`);
      return res.json({ received: true });
    }

    // ── CREATE / UPDATE — upsert by wc_product_id ─────────────────────────
    const priceCents = Math.round(parseFloat(data.regular_price || data.price || '0') * 100);

    const row = {
      name:           data.name,
      description:    data.description?.replace(/<[^>]*>/g, '').trim() || '',
      price_cents:    priceCents,
      currency:       'usd',
      image_url:      data.images?.[0]?.src || '',
      is_active:      data.status === 'publish',
      slug:           data.slug,
      wc_product_id:  data.id,
    };

    const { error } = await sb
      .from('products')
      .upsert(row, { onConflict: 'wc_product_id' });
    throwIfError(error);

    console.log(`[WC Webhook] Product "${data.name}" synced (WC #${data.id})`);
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};

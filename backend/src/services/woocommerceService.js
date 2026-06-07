/**
 * WooCommerce REST API v3 integration
 * Docs: https://woocommerce.github.io/woocommerce-rest-api-docs/
 *
 * Required env vars:
 *   WC_URL              — e.g. https://yoursite.com
 *   WC_CONSUMER_KEY     — ck_xxxxxxxx
 *   WC_CONSUMER_SECRET  — cs_xxxxxxxx
 *
 * Optional env vars:
 *   WC_CRYSTAL_CODE_ID         — WooCommerce product ID for Crystal Code
 *   WC_CRYSTAL_CODE_PREMIUM_ID — WooCommerce product ID for Crystal Code Premium
 */

function isConfigured() {
  return !!(process.env.WC_URL && process.env.WC_CONSUMER_KEY && process.env.WC_CONSUMER_SECRET);
}

/**
 * Make an authenticated request to the WooCommerce REST API
 */
async function wcRequest(method, path, body = null) {
  const credentials = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
  const url = `${process.env.WC_URL}/wp-json/wc/v3${path}`;

  const options = {
    method,
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type':  'application/json',
    },
  };

  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`WooCommerce API error ${res.status}: ${error}`);
  }

  return res.json();
}

/**
 * Create a WooCommerce order from a completed Stripe session + our internal Order doc.
 *
 * @param {Object} session  — Stripe checkout.session object
 * @param {Object} order    — Mongoose Order document (already saved to MongoDB)
 * @returns {Object}        — WooCommerce order object
 */
export async function createWooCommerceOrder(session, order) {
  if (!isConfigured()) {
    console.warn('[WooCommerce] Skipped — WC_URL / WC_CONSUMER_KEY / WC_CONSUMER_SECRET not set in .env');
    return null;
  }

  const shipping = session.shipping_details;
  const nameParts = (order.name || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName  = nameParts.slice(1).join(' ') || '';

  const addressBlock = {
    first_name: firstName,
    last_name:  lastName,
    email:      order.email || '',
    address_1:  order.address?.line1      || '',
    address_2:  order.address?.line2      || '',
    city:       order.address?.city       || '',
    state:      order.address?.state      || '',
    postcode:   order.address?.postalCode || '',
    country:    order.address?.country    || '',
  };

  // Build line items
const PRODUCT_ID_MAP = {
    'crystal-code':         parseInt(process.env.WC_CRYSTAL_CODE_ID         || '0'),
    'crystal-code-premium': parseInt(process.env.WC_CRYSTAL_CODE_PREMIUM_ID || '0'),
  };
  const wcProductId = PRODUCT_ID_MAP[order.product?.type] || 0;
  const lineItem = wcProductId
    ? { product_id: wcProductId, quantity: 1 }
    : {
        // Manual line item (no WC product linked)
        name:       order.product?.name || 'Crystal Code',
        quantity:   1,
        subtotal:   ((order.product?.price || 0) / 100).toFixed(2),
        total:      ((order.product?.price || 0) / 100).toFixed(2),
      };

  const wcOrder = await wcRequest('POST', '/orders', {
    status:   'processing',
    currency: 'USD',

    billing:  addressBlock,
    shipping: {
      first_name: firstName,
      last_name:  lastName,
      address_1:  order.address?.line1      || '',
      address_2:  order.address?.line2      || '',
      city:       order.address?.city       || '',
      state:      order.address?.state      || '',
      postcode:   order.address?.postalCode || '',
      country:    order.address?.country    || '',
    },

    line_items: [lineItem],

    // Custom meta visible in WooCommerce order detail
    meta_data: [
      { key: '_activation_code',      value: order.activationCode   || '' },
      { key: '_stripe_session_id',    value: order.stripeSessionId  || '' },
      { key: '_stripe_payment_intent',value: order.stripePaymentIntentId || '' },
      { key: '_includes_bracelet',    value: order.product?.includesBracelet ? 'yes' : 'no' },
      { key: '_abundance_order_id',   value: String(order._id) },
    ],

    // Mark payment as complete — no need for WC to collect payment
    payment_method:       'stripe',
    payment_method_title: 'Stripe',
    set_paid:             true,
  });

  console.log(`[WooCommerce] Order created — WC #${wcOrder.id} for ${order.email}`);
  return wcOrder;
}

/**
 * Update a WooCommerce order status
 * @param {number|string} wcOrderId
 * @param {string} status  — 'processing' | 'completed' | 'on-hold' | 'cancelled' | 'refunded'
 */
export async function updateWooCommerceOrderStatus(wcOrderId, status) {
  if (!isConfigured()) return null;
  return wcRequest('PUT', `/orders/${wcOrderId}`, { status });
}

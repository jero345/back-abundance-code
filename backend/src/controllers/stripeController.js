import Stripe from 'stripe';
import {
  createOrder,
  findOrderBySession,
} from '../data/orders.js';
import {
  findProfileByStripeCustomer,
  updateProfile,
} from '../data/profiles.js';
import { generateActivationCode } from '../services/activationService.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';
import { createWooCommerceOrder } from '../services/woocommerceService.js';

let _stripe;
const getStripe = () => {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
};

const PRODUCTS = {
  'crystal-code': {
    name: 'Crystal Code',
    description: 'Premium crystal sphere with unique engraved QR + illuminated base + premium box + personalized portal + complete block diagnosis',
    price: 17700, // $177.00 in cents
    includesBracelet: false,
  },
  'crystal-code-premium': {
    name: 'Crystal Code Premium',
    description: 'Everything in Crystal Code + Energy bracelet to integrate the process into your daily life',
    price: 21700, // $217.00 in cents
    includesBracelet: true,
  },
};

// POST /api/stripe/create-checkout-session
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { customerEmail, customerName, product: productKey = 'crystal-code' } = req.body;
    const product = PRODUCTS[productKey] || PRODUCTS['crystal-code'];

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: product.name, description: product.description, images: [] },
          unit_amount: product.price,
        },
        quantity: 1,
      }],
      shipping_address_collection: {
        allowed_countries: [
          'AC','AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AT','AU','AW','AX','AZ',
          'BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS',
          'BT','BV','BW','BY','BZ','CA','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO',
          'CR','CV','CW','CY','CZ','DE','DJ','DK','DM','DO','DZ','EC','EE','EG','EH','ER',
          'ES','ET','FI','FJ','FK','FO','FR','GA','GB','GD','GE','GF','GG','GH','GI','GL',
          'GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY','HK','HN','HR','HT','HU','ID',
          'IE','IL','IM','IN','IO','IQ','IS','IT','JE','JM','JO','JP','KE','KG','KH','KI',
          'KM','KN','KR','KW','KY','KZ','LA','LB','LC','LI','LK','LR','LS','LT','LU','LV',
          'LY','MA','MC','MD','ME','MF','MG','MK','ML','MM','MN','MO','MQ','MR','MS','MT',
          'MU','MV','MW','MX','MY','MZ','NA','NC','NE','NG','NI','NL','NO','NP','NR','NU',
          'NZ','OM','PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PY',
          'QA','RE','RO','RS','RW','SA','SB','SC','SE','SG','SH','SI','SJ','SK','SL','SM',
          'SN','SO','SR','SS','ST','SV','SX','SZ','TC','TD','TG','TH','TJ','TK','TL','TM',
          'TN','TO','TR','TT','TV','TW','TZ','UA','UG','US','UY','UZ','VA','VC','VE','VG',
          'VN','VU','WF','WS','XK','YE','YT','ZA','ZM','ZW',
        ],
      },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'usd' },
          display_name: 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 15 },
          },
        },
      }],
      metadata: {
        customerName: customerName || '',
        productKey,
        includesBracelet: String(product.includesBracelet),
      },
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.FRONTEND_URL}/producto`,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    next(err);
  }
};

// POST /api/stripe/webhook
export const handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object);
    }
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      await handleSubscriptionChange(event.data.object);
    }
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};

async function handleCheckoutCompleted(session) {
  // Idempotency: skip if order already exists for this session
  const existing = await findOrderBySession(session.id);
  if (existing) {
    console.log(`[Webhook] Order already exists for session ${session.id} — skipping`);
    return;
  }

  const activationCode = await generateActivationCode();
  const shipping       = session.shipping_details;
  const productKey     = session.metadata?.productKey || 'crystal-code';
  const product        = PRODUCTS[productKey] || PRODUCTS['crystal-code'];

  const order = await createOrder({
    email:                      session.customer_email,
    name:                       session.metadata?.customerName || session.customer_details?.name || '',
    address_line1:              shipping?.address?.line1       || '',
    address_line2:              shipping?.address?.line2       || null,
    address_city:               shipping?.address?.city        || '',
    address_state:              shipping?.address?.state       || null,
    address_postal_code:        shipping?.address?.postal_code || '',
    address_country:            shipping?.address?.country     || '',
    product_name:               product.name,
    product_type:               productKey,
    product_includes_bracelet:  product.includesBracelet,
    product_price_cents:        product.price,
    product_currency:           'usd',
    stripe_session_id:          session.id,
    stripe_payment_intent_id:   session.payment_intent || null,
    status:                     'paid',
    activation_code:            activationCode,
  });

  // Non-blocking integrations
  sendOrderConfirmationEmail(order).catch(err =>
    console.error('[Email] Failed to send confirmation:', err.message)
  );
  createWooCommerceOrder(session, order).catch(err =>
    console.error('[WooCommerce] Failed to create order:', err.message)
  );
}

async function handleSubscriptionChange(subscription) {
  const profile = await findProfileByStripeCustomer(subscription.customer);
  if (!profile) return;

  let next = subscription.status === 'active' ? 'active' : subscription.status;
  if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    next = 'canceled';
  }
  await updateProfile(profile.id, { subscription_status: next });
}

// GET /api/stripe/session/:sessionId
export const getSession = async (req, res, next) => {
  try {
    const stripeSession = await getStripe().checkout.sessions.retrieve(req.params.sessionId);
    const order         = await findOrderBySession(stripeSession.id);
    res.json({ session: stripeSession, order });
  } catch (err) {
    next(err);
  }
};

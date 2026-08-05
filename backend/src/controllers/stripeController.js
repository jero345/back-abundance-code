import Stripe from 'stripe';
import {
  findBySession,
  findByEmail,
  findByStripeSubscription,
  findByStripeCustomer,
  upsertByEmail,
  updateById,
} from '../data/subscriptions.js';
import {
  issueAccessCredentials,
  buildAccessUrl,
} from '../services/accessService.js';
import { sendAccessEmail } from '../services/emailService.js';

let _stripe;
const getStripe = () => {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
};

/* =============================================================================
 *  Modelo de precio
 *
 *  El usuario paga $49 hoy, que cubren sus primeros 30 días. A partir del
 *  día 31 se le cobran $14.99 al mes para mantener el acceso.
 *
 *  En Stripe eso es UNA suscripción de $14.99/mes con 30 días de trial, más
 *  un cargo único de $49 en la misma sesión de pago. El trial hace que el
 *  primer cobro mensual caiga el día 31; el cargo único se cobra al instante.
 *
 *  Los importes salen de variables de entorno y tienen que coincidir con
 *  frontend/src/config.js, que es lo que ve el usuario en la web.
 * ============================================================================*/
const OFFER = {
  initialPrice:  Number(process.env.PRICE_INITIAL_CENTS) || 4900,   // $49.00
  monthlyPrice:  Number(process.env.PRICE_MONTHLY_CENTS) || 1499,   // $14.99
  includedDays:  Number(process.env.INCLUDED_DAYS)       || 30,
};

const INITIAL_NAME  = 'Abundance Code — Acceso inicial (30 días incluidos)';
const MONTHLY_NAME  = 'Abundance Code — Acceso mensual';

const DESCRIPTION =
  'Acceso completo a la app: tu carta natal calculada y explicada, tu patrón central, ' +
  'ciclos y tránsitos, áreas clave y guía personal diaria.';

const RENEWAL_DESCRIPTION =
  'Mantiene activas tus lecturas avanzadas, señales diarias, ciclos y nueva orientación personalizada.';

// POST /api/stripe/create-subscription-session
export const createSubscriptionSession = async (req, res, next) => {
  try {
    const { customerEmail, customerName, utmCampaign } = req.body;

    if (!customerEmail) {
      return res.status(400).json({ message: 'Falta el email' });
    }

    const email = String(customerEmail).trim().toLowerCase();

    /* Si ya tiene una suscripción activa no tiene sentido cobrarle otra vez. */
    const existing = await findByEmail(email);
    if (existing && existing.status === 'active' && existing.source === 'stripe') {
      return res.json({
        alreadySubscribed: true,
        message: 'Ya tienes una suscripción activa con este correo.',
      });
    }

    /* El token se genera AQUÍ, antes del pago, para poder meterlo en el
     * success_url. Así, al terminar de pagar, Stripe devuelve al usuario
     * directamente a la app con su acceso ya en la mano — sin pasar por el
     * correo, que es donde se pierde la gente. El webhook lo persiste. */
    const credentials = await issueAccessCredentials();

    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        /* Cargo único: se cobra hoy y cubre los primeros 30 días. */
        {
          price_data: {
            currency: 'usd',
            product_data: { name: INITIAL_NAME, description: DESCRIPTION },
            unit_amount: OFFER.initialPrice,
          },
          quantity: 1,
        },
        /* Suscripción: en trial durante los días incluidos, así que su primer
         * cobro cae el día 31. A partir de ahí, cada mes. */
        {
          price_data: {
            currency: 'usd',
            product_data: { name: MONTHLY_NAME, description: RENEWAL_DESCRIPTION },
            unit_amount: OFFER.monthlyPrice,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      /* Los metadatos viajan hasta el webhook: es como el token generado antes
       * del pago sobrevive hasta el momento de guardarlo. */
      metadata: {
        customerName: customerName || '',
        utmCampaign:  utmCampaign || '',
        accessToken:  credentials.access_token,
        accessCode:   credentials.access_code,
      },
      subscription_data: {
        /* El trial NO es acceso gratis: son los 30 días que el usuario ya
         * pagó con el cargo inicial. Sirve para retrasar el primer cobro. */
        trial_period_days: OFFER.includedDays,
        metadata: { customerName: customerName || '' },
      },
      allow_promotion_codes: true,
      success_url: buildAccessUrl(credentials.access_token),
      cancel_url:  `${process.env.FRONTEND_URL}/pricing`,
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
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        break;
    }
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};

async function handleCheckoutCompleted(session) {
  // Idempotencia: Stripe reintenta los webhooks, así que puede llegar repetido.
  const existing = await findBySession(session.id);
  if (existing) {
    console.log(`[Webhook] Suscripción ya registrada para la sesión ${session.id} — se omite`);
    return;
  }

  const email = (session.customer_email || session.customer_details?.email || '')
    .trim().toLowerCase();
  if (!email) {
    console.error('[Webhook] checkout.session.completed sin email — no se puede vincular el acceso');
    return;
  }

  /* Normalmente el token viene de los metadatos (se creó al abrir el checkout).
   * Si por lo que sea no llegó, se genera aquí y el usuario lo recibe por
   * correo — sigue teniendo acceso, sólo pierde la vuelta directa. */
  const credentials = session.metadata?.accessToken
    ? {
        access_token:     session.metadata.accessToken,
        access_code:      session.metadata.accessCode || null,
        token_expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      }
    : await issueAccessCredentials();

  let currentPeriodEnd = null;
  if (session.subscription) {
    try {
      const sub = await getStripe().subscriptions.retrieve(session.subscription);
      currentPeriodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;
    } catch (err) {
      console.error('[Webhook] No se pudo leer la suscripción de Stripe:', err.message);
    }
  }

  const record = await upsertByEmail({
    email,
    name:                   session.metadata?.customerName || session.customer_details?.name || null,
    stripe_customer_id:     session.customer || null,
    stripe_subscription_id: session.subscription || null,
    stripe_session_id:      session.id,
    plan:                   'monthly',
    /* Lo cobrado hoy. La cuota mensual posterior se consulta en Stripe. */
    price_cents:            OFFER.initialPrice,
    currency:               'usd',
    status:                 'active',
    current_period_end:     currentPeriodEnd,
    source:                 'stripe',
    utm_campaign:           session.metadata?.utmCampaign || null,
    ...credentials,
    // Una suscripción nueva estrena token: se limpia cualquier canje anterior.
    redeemed_at:            null,
    app_user_id:            null,
    reminders_sent:         0,
  });

  // El correo es la red de seguridad de quien cerró la pestaña tras pagar.
  sendAccessEmail(record).catch(err =>
    console.error('[Email] No se pudo enviar el acceso:', err.message)
  );
}

async function handleSubscriptionChange(subscription) {
  const record =
    (await findByStripeSubscription(subscription.id)) ||
    (await findByStripeCustomer(subscription.customer));
  if (!record) return;

  /* Stripe tiene más estados de los que necesitamos. Lo único que importa
   * para dar o quitar acceso es: activa, en gracia por impago, o cerrada. */
  let status = 'active';
  if (['canceled', 'unpaid', 'incomplete_expired'].includes(subscription.status)) {
    status = 'canceled';
  } else if (subscription.status === 'past_due') {
    status = 'past_due';
  } else if (subscription.status === 'incomplete') {
    status = 'incomplete';
  }

  await updateById(record.id, {
    status,
    stripe_subscription_id: subscription.id,
    current_period_end: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : record.current_period_end,
  });
}

async function handlePaymentFailed(invoice) {
  const record = await findByStripeCustomer(invoice.customer);
  if (!record) return;
  await updateById(record.id, { status: 'past_due' });
}

// GET /api/stripe/session/:sessionId
export const getSession = async (req, res, next) => {
  try {
    const stripeSession = await getStripe().checkout.sessions.retrieve(req.params.sessionId);
    const subscription  = await findBySession(stripeSession.id);
    res.json({ session: stripeSession, subscription });
  } catch (err) {
    next(err);
  }
};

// POST /api/stripe/portal  { email }
// Portal de cliente de Stripe: cancelar, cambiar tarjeta y ver facturas.
// Es lo que cumple la promesa de "cancela en dos clics" sin construirlo a mano.
export const createPortalSession = async (req, res, next) => {
  try {
    const email  = String(req.body.email || '').trim().toLowerCase();
    const record = await findByEmail(email);

    if (!record || !record.stripe_customer_id) {
      return res.status(404).json({ message: 'No encontramos una suscripción con ese correo.' });
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer:   record.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

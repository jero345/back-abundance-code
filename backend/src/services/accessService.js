import crypto from 'crypto';
import { generateActivationCode } from './activationService.js';

/* =============================================================================
 *  Acceso a la app
 *
 *  El usuario paga en la web. Para que pueda entrar a la app hace falta unir
 *  dos cosas que viven en sistemas distintos: el pago (aquí) y la cuenta (allá).
 *
 *  Esa unión se hace con un token de un solo uso que YA lleva dentro el email
 *  que pagó. Así el usuario no tiene que acordarse de registrarse con el mismo
 *  correo: es la app la que lo vincula sola al canjear el token.
 * ============================================================================*/

/* Vale 30 días: quien pagó no debería perder el acceso por tardar en activar.
 * Si se le pasa, la página de reenvío le genera uno nuevo. */
const TOKEN_TTL_DAYS = 30;

export function generateAccessToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export function tokenExpiry(days = TOKEN_TTL_DAYS) {
  return new Date(Date.now() + days * 24 * 3600 * 1000).toISOString();
}

/* Token + código corto de respaldo, por si el enlace se rompe en el cliente
 * de correo y el usuario tiene que escribirlo a mano o dárselo a soporte. */
export async function issueAccessCredentials() {
  return {
    access_token:     generateAccessToken(),
    access_code:      await generateActivationCode(),
    token_expires_at: tokenExpiry(),
  };
}

/* URL de entrada a la app. Es también el success_url de Stripe, así que la
 * mayoría activa sin salir del flujo y sin depender del correo. */
export function buildAccessUrl(token) {
  const base = (process.env.APP_PUBLIC_URL || 'https://astro-ai-decoder.lovable.app').replace(/\/$/, '');
  const path = process.env.APP_ACTIVATE_PATH || '/activar';
  return `${base}${path}?token=${encodeURIComponent(token)}`;
}

/* Lo que la app necesita saber para dar o quitar acceso. Nada más:
 * ni datos de tarjeta, ni ids internos de Stripe. */
export function toEntitlement(sub) {
  if (!sub) return null;
  return {
    email:              sub.email,
    name:               sub.name || null,
    plan:               sub.plan,
    status:             sub.status,
    source:             sub.source,
    currentPeriodEnd:   sub.current_period_end,
    hasAccess:          sub.status === 'active' || sub.status === 'past_due',
    utmCampaign:        sub.utm_campaign || null,
  };
}

export function isTokenValid(sub) {
  if (!sub || !sub.access_token) return false;
  if (sub.redeemed_at) return false;
  if (sub.token_expires_at && new Date(sub.token_expires_at) < new Date()) return false;
  return true;
}

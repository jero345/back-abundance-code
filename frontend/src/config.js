/* =========================================================
   ABUNDANCE CODE — Configuración del funnel
   Único sitio donde viven la URL de la app y los precios.
   Cambiar aquí y se propaga a toda la web.
   ========================================================= */

/* URL base de la web app.
   Sobrescribible en build con VITE_APP_URL — cambiar aquí cuando la app
   se mueva del dominio de Lovable a un subdominio propio. */
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://astro-ai-decoder.lovable.app';

/* Ruta de entrada a la app. Hoy la app entra por /activar (código + magic
   link + Google). Si más adelante se abre un registro libre, basta cambiar
   esta constante. */
export const SIGNUP_PATH = import.meta.env.VITE_APP_SIGNUP_PATH || '/activar';

/* =========================================================
   MODELO DE PRECIO
   Pago inicial de $49 que incluye los primeros 30 días.
   A partir del día 31, $14.99/mes para mantener el acceso.

   En Stripe se traduce en una única suscripción de $14.99/mes con
   30 días de trial y un cargo único de $49 cobrado al momento.
   Los importes de verdad viven en el backend (.env); estos son los
   que se muestran en la web y deben coincidir.
   ========================================================= */
export const CURRENCY = 'USD';

/* Lo que se paga hoy. */
export const PRICE_INITIAL = 49;

/* Días de acceso que cubre ese pago inicial. */
export const INCLUDED_DAYS = 30;

/* Lo que se cobra a partir del día 31, cada mes. */
export const PRICE_MONTHLY = 14.99;

/* ¿La web ofrece días GRATIS?
   No: los 30 días primeros están pagados con los $49. Esta constante
   existe para poder activar una prueba gratuita de verdad más adelante
   sin reescribir copy — el texto ya está traducido (ver LanguageContext). */
export const TRIAL_ENABLED = false;
export const TRIAL_DAYS = 7;

/* Formatea un importe respetando los decimales sólo cuando los tiene:
   49 → "49" · 14.99 → "14.99" */
export function money(amount) {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
}

/* Construye una URL de la app con UTM para poder medir el funnel.
   appUrl(SIGNUP_PATH, 'hero') → https://…/activar?utm_source=website&utm_medium=cta&utm_campaign=hero */
export function appUrl(path = SIGNUP_PATH, source = 'web') {
  const url = new URL(path, APP_URL);
  url.searchParams.set('utm_source', 'website');
  url.searchParams.set('utm_medium', 'cta');
  url.searchParams.set('utm_campaign', source);
  return url.toString();
}

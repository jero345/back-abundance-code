import crypto from 'crypto';

/* =============================================================================
 *  Autenticación servidor a servidor entre la app y este backend.
 *
 *  Los endpoints de /api/access exponen el estado de la suscripción de una
 *  persona a partir de su correo. Eso no puede quedar abierto: cualquiera
 *  podría ir probando correos. El secreto vive sólo en el servidor de la app,
 *  nunca en el navegador.
 * ============================================================================*/

/* Comparación en tiempo constante: evita que se pueda adivinar el secreto
 * midiendo cuánto tarda en fallar. */
function safeEqual(a = '', b = '') {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function requireAppSecret(req, res, next) {
  const expected = process.env.APP_SHARED_SECRET;

  if (!expected) {
    console.error('[appAuth] Falta APP_SHARED_SECRET — se rechazan las llamadas de la app');
    return res.status(503).json({ message: 'Integración con la app no configurada' });
  }

  const header = req.headers['authorization'] || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : req.headers['x-app-secret'];

  if (!safeEqual(token, expected)) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  next();
}

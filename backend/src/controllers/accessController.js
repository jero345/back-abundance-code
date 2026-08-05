import {
  findByToken,
  findByEmail,
  updateById,
} from '../data/subscriptions.js';
import {
  issueAccessCredentials,
  toEntitlement,
  isTokenValid,
} from '../services/accessService.js';
import { sendAccessEmail } from '../services/emailService.js';

/* =============================================================================
 *  Puente entre el pago (aquí) y la cuenta de la app (allá).
 *
 *  /redeem  → la app canjea el token y recibe el email que pagó
 *  /status  → la app pregunta si alguien sigue teniendo acceso
 *  /resend  → el usuario pide que le reenvíen su enlace
 * ============================================================================*/

// POST /api/access/redeem   { token, appUserId? }   [requiere secreto de la app]
export const redeemToken = async (req, res, next) => {
  try {
    const { token, appUserId } = req.body;
    if (!token) return res.status(400).json({ message: 'Falta el token' });

    const record = await findByToken(token);
    if (!record) {
      return res.status(404).json({ message: 'Token no encontrado', reason: 'not_found' });
    }

    /* Si ya se canjeó, se devuelve el mismo resultado en vez de un error.
     * El usuario puede volver a abrir el enlace del correo, o recargar la
     * página, y no tiene por qué encontrarse con un fallo: su acceso existe. */
    if (record.redeemed_at) {
      return res.json({
        ...toEntitlement(record),
        alreadyRedeemed: true,
        redeemedAt: record.redeemed_at,
      });
    }

    if (!isTokenValid(record)) {
      return res.status(410).json({
        message: 'Este enlace caducó. Pide uno nuevo desde la web.',
        reason: 'expired',
        email: record.email,
      });
    }

    const updated = await updateById(record.id, {
      redeemed_at: new Date().toISOString(),
      app_user_id: appUserId || null,
    });

    res.json({ ...toEntitlement(updated), alreadyRedeemed: false });
  } catch (err) {
    next(err);
  }
};

// GET /api/access/status?email=...   [requiere secreto de la app]
// La app la llama al iniciar sesión para enterarse de cancelaciones e impagos.
export const getStatus = async (req, res, next) => {
  try {
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ message: 'Falta el email' });

    const record = await findByEmail(email);
    if (!record) {
      return res.json({ email, hasAccess: false, status: 'none' });
    }

    res.json(toEntitlement(record));
  } catch (err) {
    next(err);
  }
};

// POST /api/access/resend   { email }   [público]
export const resendAccess = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ message: 'Falta el email' });

    const record = await findByEmail(email);

    /* Respuesta idéntica exista o no la suscripción: si dijéramos "ese correo
     * no existe" estaríamos dejando que cualquiera averigüe quién es cliente. */
    const genericResponse = {
      ok: true,
      message: 'Si hay una suscripción con ese correo, te acabamos de enviar el enlace de acceso.',
    };

    if (!record || record.status === 'canceled') {
      return res.json(genericResponse);
    }

    /* Token nuevo en cada reenvío: invalida el anterior por si el correo
     * viejo acabó en manos de otra persona. */
    const credentials = await issueAccessCredentials();
    const updated = await updateById(record.id, {
      ...credentials,
      redeemed_at: null,
    });

    await sendAccessEmail(updated);

    res.json(genericResponse);
  } catch (err) {
    next(err);
  }
};

import { Router } from 'express';
import { redeemToken, getStatus, resendAccess } from '../controllers/accessController.js';
import { requireAppSecret } from '../middleware/appAuth.js';

const router = Router();

/* Servidor a servidor: sólo la app, con el secreto compartido. */
router.post('/redeem', requireAppSecret, redeemToken);
router.get('/status',  requireAppSecret, getStatus);

/* Público: lo llama la web cuando alguien perdió su enlace de acceso.
   Responde lo mismo exista o no la suscripción, para no filtrar quién es cliente. */
router.post('/resend', resendAccess);

export default router;

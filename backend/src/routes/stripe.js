import { Router } from 'express';
import { createCheckoutSession, handleWebhook, getSession } from '../controllers/stripeController.js';

const router = Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/webhook', handleWebhook); // raw body handled in server.js
router.get('/session/:sessionId', getSession);

export default router;

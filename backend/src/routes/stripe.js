import { Router } from 'express';
import {
  createSubscriptionSession,
  handleWebhook,
  getSession,
  createPortalSession,
} from '../controllers/stripeController.js';

const router = Router();

router.post('/create-subscription-session', createSubscriptionSession);
router.post('/webhook', handleWebhook); // raw body handled in server.js
router.get('/session/:sessionId', getSession);
router.post('/portal', createPortalSession);

export default router;

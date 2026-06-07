import { Router } from 'express';
import { handleWcWebhook } from '../controllers/wcWebhookController.js';

const router = Router();

// Needs raw body for signature verification
router.post('/', handleWcWebhook);

export default router;

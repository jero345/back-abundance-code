import { Router } from 'express';
import { getOrderBySession, getMyOrders, updateTracking } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/session/:sessionId', getOrderBySession);
router.get('/my', protect, getMyOrders);
router.patch('/:id/tracking', protect, updateTracking); // TODO: add admin middleware

export default router;

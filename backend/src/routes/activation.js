import { Router } from 'express';
import { activateSphere, getDailyActivation } from '../controllers/activationController.js';
import { protect, requireActivation } from '../middleware/auth.js';

const router = Router();

router.post('/activate', activateSphere);
router.get('/daily', protect, requireActivation, getDailyActivation);

export default router;

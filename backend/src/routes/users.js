import { Router } from 'express';
import {
  register, login, logout, getMe, updateProfileCtrl,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register',  register);
router.post('/login',     login);
router.post('/logout',    protect, logout);
router.get('/me',         protect, getMe);
router.patch('/profile',  protect, updateProfileCtrl);

export default router;

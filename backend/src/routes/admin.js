import { Router } from 'express';
import { getOrders, getOrderById, updateOrderCtrl, getStats, getUsers } from '../controllers/adminController.js';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { adminGetPosts, adminGetPost, adminCreatePost, adminUpdatePost, adminDeletePost } from '../controllers/blogController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, requireAdmin);

router.get('/stats', getStats);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id', updateOrderCtrl);
router.get('/users', getUsers);

// Products
router.get('/products', getProducts);
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Blog
router.get('/blog', adminGetPosts);
router.get('/blog/:id', adminGetPost);
router.post('/blog', adminCreatePost);
router.patch('/blog/:id', adminUpdatePost);
router.delete('/blog/:id', adminDeletePost);

export default router;

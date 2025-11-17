import { Router } from 'express';
import { addItem, updateItem, removeItem, getCart } from '../controllers/cartController';
import { getItems } from '../controllers/itemController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Items route (public - no authentication required)
router.get('/items', getItems);

// All cart routes require authentication
router.use(authenticate);

// Cart routes
router.post('/cart/items', addItem);
router.put('/cart/items/:itemId', updateItem);
router.delete('/cart/items/:itemId', removeItem);
router.get('/cart', getCart);

export default router;


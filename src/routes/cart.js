// src/routes/cart.js

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';

const router = express.Router();

router.use(authenticateToken);

// Route Map
router.get('/', getCart);                     // GET /api/v1/cart (View items in user's cart)
router.post('/items', addToCart);             // POST /api/v1/cart/items (Add item)
router.put('/items/:productId', updateCartItem); // PUT /api/v1/cart/items/:productId (Change quantity)
router.delete('/items/:productId', removeFromCart); // DELETE /api/v1/cart/items/:productId (Remove item)

export default router;
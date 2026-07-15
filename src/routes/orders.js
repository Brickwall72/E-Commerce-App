// src/routes/orders.js

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getAllOrders, getOrderById, checkoutOrder } from '../controllers/orderController.js';


const router = express.Router();

// Placeholder controller functions
router.use(authenticateToken);

// Route Map
router.post('/', checkoutOrder);        // POST /api/v1/orders (Executes checkout)
router.get('/', getAllOrders);     // GET /api/v1/orders (View personal history)
router.get('/:id', getOrderById);     // GET /api/v1/orders/:id (View exact receipt)

export default router;

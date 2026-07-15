// src/routes/orders.js

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getAllOrders, getOrderById, checkoutOrder } from '../controllers/orderController.js';

const router = express.Router();

// Shortcut Route Guard: Automatically enforces secure identity validation for all operations below
router.use(authenticateToken);

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     summary: Execute Shopping Cart Checkout (Place Order)
 *     description: Core transactional endpoint. Checks out a single connection client from the database pool, validates shelf stock limits, freezes pricing snapshots into the order_products ledger, adjusts global warehouse inventory rows, and purges the active cart on success.
 *     tags:
 *       - Orders & Transactions Module
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shipping_address
 *             properties:
 *               shipping_address:
 *                 type: string
 *                 description: Absolute physical destination address to record on the invoice ledger.
 *                 example: "456 Server Partition Road, Austin TX"
 *     responses:
 *       201:
 *         description: Atomic transaction completed successfully. Order row initialized and cart purged.
 *       400:
 *         description: Missing shipping parameters or the user's active shopping cart contains 0 items.
 *       401:
 *         description: Access blocked. Authentication token missing.
 *       409:
 *         description: Inventory Conflict. Item stock shortage detected; transaction rolled back cleanly.
 *       500:
 *         description: Internal database processing error or connection failure mid-transaction.
 */
router.post('/', checkoutOrder);

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: Retrieve Historical Purchase Invoices
 *     description: Fetches a complete list directory of all historically finalized order invoices matching the current authenticated user account.
 *     tags:
 *       - Orders & Transactions Module
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List array of matching historical user invoices returned successfully.
 *       401:
 *         description: Access blocked. Token missing.
 *       500:
 *         description: Internal database communication error exception.
 */
router.get('/', getAllOrders);

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   get:
 *     summary: View Specific Invoice Receipt by ID
 *     description: Searches your transactional logs for a single parent invoice record matching the provided UUID string parameter.
 *     tags:
 *       - Orders & Transactions Module
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The target parent order unique UUID identifier key token.
 *         example: "e5f67a8b-9c0d-1e2f-3a4b-5c6da9b2c3d4"
 *     responses:
 *       200:
 *         description: Specific order record located and returned successfully.
 *       401:
 *         description: Authentication token missing.
 *       404:
 *         description: Provided UUID string does not map to a saved transaction log row.
 *       500:
 *         description: Internal system lookup failure.
 */
router.get('/:id', getOrderById);

export default router;

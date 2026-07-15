// src/routes/cart.js

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';

const router = express.Router();

// Shortcut Route Guard: Automatically secures all shopping cart paths below
router.use(authenticateToken);

/**
 * @openapi
 * /api/v1/cart:
 *   get:
 *     summary: Fetch Active Shopping Cart Contents
 *     description: Uses the validated user token context payload to extract the current customer's specific item lines, prices, and dynamically calculated subtotals.
 *     tags:
 *       - Shopping Cart Module
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User cart payload fetched and compiled successfully.
 *       401:
 *         description: Access blocked. Active validation session token is missing.
 *       403:
 *         description: Provided session token pass string is corrupted or expired.
 *       500:
 *         description: Internal database communication error exception.
 */
router.get('/', getCart);

/**
 * @openapi
 * /api/v1/cart/items:
 *   post:
 *     summary: Add Product to Shopping Cart
 *     description: Verifies inventory availability and registers an item into the customer's cart. Utilizes an idempotent upsert sequence to increment quantities automatically if the product link already exists.
 *     tags:
 *       - Shopping Cart Module
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: string
 *                 format: uuid
 *                 description: The unique UUID target inventory product key.
 *                 example: "a9b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Total item units to append.
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product line item successfully registered or incremented within the cart.
 *       400:
 *         description: Invalid or incomplete payload parameters provided.
 *       404:
 *         description: Targeted product ID does not exist inside store inventory shelf rows.
 *       401:
 *         description: Authentication token missing.
 *       500:
 *         description: Internal server error.
 */
router.post('/items', addToCart);

/**
 * @openapi
 * /api/v1/cart/items/{productId}:
 *   put:
 *     summary: Update Cart Item Quantity On The Fly
 *     description: Hard-overwrites the item quantity value for a specific product currently sitting inside the authenticated user's shopping cart.
 *     tags:
 *       - Shopping Cart Module
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The exact item unique UUID identifier key token to adjust.
 *         example: "a9b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: The new absolute quantity count to assign to the row.
 *                 example: 5
 *     responses:
 *       200:
 *         description: Shopping cart quantities adjusted successfully.
 *       400:
 *         description: Invalid quantity integer sent.
 *       404:
 *         description: Target item record not found inside your active shopping cart canvas.
 *       401:
 *         description: Authentication token missing.
 *       500:
 *         description: Internal database update crash.
 */
router.put('/items/:productId', updateCartItem);

/**
 * @openapi
 * /api/v1/cart/items/{productId}:
 *   delete:
 *     summary: Remove an Item from the Cart Completely
 *     description: Permanently wipes out a specific product line row linkage from the customer's active shopping cart canvas.
 *     tags:
 *       - Shopping Cart Module
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The targeted product unique UUID identifier key to excise.
 *         example: "a9b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
 *     responses:
 *       200:
 *         description: Item removed from shopping cart canvas successfully.
 *       404:
 *         description: Target product row link not found inside this user's cart.
 *       401:
 *         description: Authentication token missing.
 *       500:
 *         description: Internal database deletion operation failure.
 */
router.delete('/items/:productId', removeFromCart);

export default router;

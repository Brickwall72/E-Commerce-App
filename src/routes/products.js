// src/routes/products.js

import express from 'express';
import { getAllProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Browse Full Product Catalog
 *     description: Fetches a complete, alphabetized directory list of all available store products directly from the database shelf rows.
 *     tags:
 *       - Product Catalog Module
 *     responses:
 *       200:
 *         description: Direct matrix array of available store items returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 20
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal database communication lookup error exception.
 */
router.get('/', getAllProducts);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     summary: View Specific Product by ID
 *     description: Searches your store inventory rows for a single item matching the provided UUID string parameter.
 *     tags:
 *       - Product Catalog Module
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The target product item unique UUID identifier key token.
 *         example: "a9b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
 *     responses:
 *       200:
 *         description: Specific product parameters located and returned successfully.
 *       404:
 *         description: Provided UUID string does not map to an active inventory item record.
 *       500:
 *         description: Internal database tracking lookup crash.
 */
router.get('/:id', getProductById);

export default router;

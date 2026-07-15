// src/routes/products.js

import express from 'express';
import { getAllProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

// Route Map: Relative to the mount point in index.js
router.get('/', getAllProducts);         // GET /api/v1/products
router.get('/:id', getProductById);     // GET /api/v1/products/:id

export default router;
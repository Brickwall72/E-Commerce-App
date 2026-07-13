// src/routes/products.js

import express from 'express';

const router = express.Router();

// Placeholder controller functions
const getAllProductsPlaceholder = (req, res) => res.json({ message: "Browse all products endpoint is mapped!" });
const getProductByIdPlaceholder = (req, res) => res.json({ message: `View product ${req.params.id} endpoint is mapped!` });

// Route Map: Relative to the mount point in index.js
router.get('/', getAllProductsPlaceholder);         // GET /api/v1/products
router.get('/:id', getProductByIdPlaceholder);     // GET /api/v1/products/:id

export default router;
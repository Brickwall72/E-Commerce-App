// index.js

import express from 'express';
import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import orderRoutes from './src/routes/orders.js';
import cartRoutes from './src/routes/cart.js';

const app = express();
const PORT = 3000;

// Global Middleware to parse JSON payloads automatically
app.use(express.json());

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

// Complete REST API Core Route System
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', cartRoutes);

// Baseline structural health check
app.get('/health', (req, res) => {
    res.json({ status: "UP", message: "E-Commerce REST API is completely operational" });
});

app.listen(PORT, () => {
    console.log(`🚀 E-Commerce API Server listening securely on port ${PORT}`);
});
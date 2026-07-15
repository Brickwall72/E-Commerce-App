// src/controllers/productController.js

import { query } from '../config/db.js'; // Imports our centralized pool driver

// FEATURE 1: BROWSE ALL PRODUCTS (Using simple pool.query)
// Endpoint: GET /api/v1/products
export const getAllProducts = async (req, res) => {
    try {
        // Execute a straightforward lookup query against the products table
        const result = await query('SELECT id, title, description, price, inventory_quantity FROM products ORDER BY title ASC;');
        
        // Return a clean 200 success response containing the database row array
        return res.status(200).json({
            count: result.rows.length,
            products: result.rows
        });
        
    } catch (error) {
        console.error('❌ Database error during getAllProducts:', error);
        return res.status(500).json({ error: 'Internal server error retrieving product inventory.' });
    }
};

// FEATURE 2: VIEW A SPECIFIC PRODUCT BY ID
// Endpoint: GET /api/v1/products/:id
export const getProductById = async (req, res) => {
    const { id } = req.params; // Grabs the UUID string straight out of the URL path

    try {
        // Defensive Parameterized Query ($1) prevents SQL Injection security attacks
        const result = await query('SELECT id, title, description, price, inventory_quantity FROM products WHERE id = $1;', [id]);
        
        // If the array comes back completely empty, the requested item ID doesn't exist
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found in store catalog.' });
        }
        
        // Return the single product object found at index 0
        return res.status(200).json({
            product: result.rows[0]
        });

    } catch (error) {
        console.error(`❌ Database error during getProductById for ID [${id}]:`, error);
        return res.status(500).json({ error: 'Internal server error searching for product record.' });
    }
};

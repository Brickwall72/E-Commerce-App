// src/controllers/orderController.js

import { query, poolInstance } from '../config/db.js'; // Imports our centralized pool driver


// FEATURE 1: BROWSE ALL ORDERS (Using simple pool.query)
// Endpoint: GET /api/v1/orders
export const getAllOrders = async (req, res) => {
    try {
        // Execute a straightforward lookup query against the orders table
        const result = await query('SELECT id, user_id, total_amount, status FROM orders ORDER BY user_id;');
        
        // Return a clean 200 success response containing the database row array
        return res.status(200).json({
            count: result.rows.length,
            orders: result.rows
        });
        
    } catch (error) {
        console.error('❌ Database error during getAllOrders:', error);
        return res.status(500).json({ error: 'Internal server error retrieving order history.' });
    }
};

// FEATURE 2: VIEW A SPECIFIC ORDER BY ID
// Endpoint: GET /api/v1/orders/:id
export const getOrderById = async (req, res) => {
    const { id } = req.params; // Grabs the UUID string straight out of the URL path

    try {
        // Defensive Parameterized Query ($1) prevents SQL Injection security attacks
        const result = await query('SELECT id, user_id, total_amount, status FROM orders WHERE id = $1;', [id]);
        
        // If the array comes back completely empty, the requested item ID doesn't exist
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found in order history logs.' });
        }
        
        // Return the single order object found at index 0
        return res.status(200).json({
            order: result.rows[0]
        });

    } catch (error) {
        console.error(`❌ Database error during getOrderById for ID [${id}]:`, error);
        return res.status(500).json({ error: 'Internal server error searching for order record.' });
    }
};

// FEATURE 3: ADD A NEW ORDER
// Endpoint: POST /api/v1/orders

export const checkoutOrder = async (req, res) => {
    const { shipping_address } = req.body;

    if (!shipping_address) {
        return res.status(400).json({ error: "A valid shipping address is required for checkout." });
    }
        
    const userId = req.user.id; 

    // 1. Check out a dedicated, single connection client from the pool
    const client = await poolInstance.connect();

    try {
        // 2. Open the atomic transaction wall
        await client.query('BEGIN');

        // STEP B: Fetch all items currently sitting inside this user's cart
        const cartItemsQuery = `
            SELECT cp.product_id, cp.quantity, p.price, p.inventory_quantity, p.title
            FROM cart_products cp
            JOIN carts c ON cp.cart_id = c.id
            JOIN products p ON cp.product_id = p.id
            WHERE c.user_id = $1;
        `;
        const cartItems = await client.query(cartItemsQuery, [userId]);

        if (cartItems.rows.length === 0) {
            return res.status(400).json({ error: "Your shopping cart is completely empty." });
        }

        // STEP C: Validate stock quantities and calculate the absolute order price subtotal
        let totalAmount = 0;
        
        for (const item of cartItems.rows) {
            if (item.inventory_quantity < item.quantity) {
                // Instantly fail and abort if someone bought the item out from under them!
                throw new Error(`INSUFFICIENT_STOCK: ${item.title}`);
            }
            totalAmount += parseFloat(item.price) * item.quantity;
        }

        // STEP D: Insert the master parent order receipt row
        const insertOrderQuery = `
            INSERT INTO orders (user_id, shipping_address, total_amount, status)
            VALUES ($1, $2, $3, 'PAID')
            RETURNING id;
        `;
        const orderResult = await client.query(insertOrderQuery, [userId, shipping_address, totalAmount]);
        const newOrderId = orderResult.rows[0].id;

        // STEP E: Move each product line item into the immutable order_products archive 
        // AND subtract the inventory quantities from our live store shelf stock rows
        for (const item of cartItems.rows) {
            // Write the history row
            const insertItemQuery = `
                INSERT INTO order_products (order_id, product_id, quantity, price_at_purchase)
                VALUES ($1, $2, $3, $4);
            `;
            await client.query(insertItemQuery, [newOrderId, item.product_id, item.quantity, item.price]);

            // Deduct stock row values
            const deductStockQuery = `
                UPDATE products 
                SET inventory_quantity = inventory_quantity - $1 
                WHERE id = $2;
            `;
            await client.query(deductStockQuery, [item.quantity, item.product_id]);
        }

        // STEP F: Clear out the customer's active shopping cart items list completely
        const clearCartQuery = `
            DELETE FROM cart_products 
            WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1);
        `;
        await client.query(clearCartQuery, [userId]);

        // 3. COMMIT: Everything cleared perfectly! Lock down all changes permanently onto the disk
        await client.query('COMMIT');
        
        return res.status(201).json({
            message: "Checkout successful! Order placed.",
            order_id: newOrderId,
            total_charged: totalAmount
        });

    } catch (error) {
        // 4. ROLLBACK: If stock was short or a connection blinked, undo every change completely.
        // Carts remain populated, and no product quantities are deducted from shelves!
        await client.query('ROLLBACK');
        console.error("❌ Checkout transaction failed, system rolled back cleanly:", error.message);
        
        if (error.message.startsWith('INSUFFICIENT_STOCK')) {
            return res.status(409).json({ error: "Item stock error. Checkout aborted to protect data integrity." });
        }
        return res.status(500).json({ error: "Internal transaction failure processing checkout order." });

    } finally {
        // 5. CRITICAL: Release the client connection socket back to the pool
        client.release();
    }
};

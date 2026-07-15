// src/controllers/cartController.js

import { query } from '../config/db.js';

// FEATURE 1: VIEW ACTIVE SHOPPING CART CONTENTS
// Endpoint: GET /api/v1/cart
export const getCart = async (req, res) => {
    const userId = req.user.id; // Extracted directly from your verified JWT pass token

    try {
        const fetchCartQuery = `
            SELECT p.id AS product_id, p.title, p.price, cp.quantity, (p.price * cp.quantity) AS subtotal
            FROM cart_products cp
            JOIN carts c ON cp.cart_id = c.id
            JOIN products p ON cp.product_id = p.id
            WHERE c.user_id = $1
            ORDER BY p.title ASC;
        `;
        const result = await query(fetchCartQuery, [userId]);

        // Calculate total cart value dynamically across rows
        const cartTotal = result.rows.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

        return res.status(200).json({
            user_id: userId,
            item_count: result.rows.length,
            cart_total: cartTotal.toFixed(2),
            items: result.rows
        });

    } catch (error) {
        console.error('❌ Database error during getCart:', error);
        return res.status(500).json({ error: 'Internal server error retrieving shopping cart.' });
    }
};

// FEATURE 2: ADD PRODUCT TO SHOPPING CART (With Upsert Handling)
// Endpoint: POST /api/v1/cart/items
export const addToCart = async (req, res) => {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity <= 0) {
        return res.status(400).json({ error: "Valid product_id and a positive quantity integer are required." });
    }

    try {
        // 1. Verify that the requested product actually exists in our store inventory catalog
        const productCheck = await query('SELECT title, inventory_quantity FROM products WHERE id = $1;', [product_id]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: "Product not found in store inventory catalog." });
        }

        // 2. Locate or create the master parent cart row for this specific user profile
        // (Ensures a user always maps to an active cart container shell)
        let cartResult = await query('SELECT id FROM carts WHERE user_id = $1;', [userId]);
        let cartId;

        if (cartResult.rows.length === 0) {
            const newCart = await query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id;', [userId]);
            cartId = newCart.rows[0].id;
        } else {
            cartId = cartResult.rows[0].id;
        }

        // 3. IDEMPOTENT UPSERT: If item isn't in cart, insert it. 
        // If it is already there, increment the existing quantity row smoothly!
        const upsertQuery = `
            INSERT INTO cart_products (cart_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (cart_id, product_id) 
            DO UPDATE SET quantity = cart_products.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP
            RETURNING id, cart_id, product_id, quantity;
        `;
        const cartProductRow = await query(upsertQuery, [cartId, product_id, quantity]);

        return res.status(201).json({
            message: `Successfully added ${productCheck.rows[0].title} to shopping cart.`,
            item: cartProductRow.rows[0]
        });

    } catch (error) {
        console.error('❌ Database error during addToCart:', error);
        return res.status(500).json({ error: 'Internal server error appending item to cart.' });
    }
};

// FEATURE 3: UPDATE CART ITEM QUANTITY ON THE FLY
// Endpoint: PUT /api/v1/cart/items/:productId
export const updateCartItem = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params; // Extracted from URL path parameter token
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: "Quantity parameter must be a positive integer value." });
    }

    try {
        const updateQuery = `
            UPDATE cart_products
            SET quantity = $1, updated_at = CURRENT_TIMESTAMP
            WHERE product_id = $2 
            AND cart_id = (SELECT id FROM carts WHERE user_id = $3)
            RETURNING id, product_id, quantity;
        `;
        const result = await query(updateQuery, [quantity, productId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Target item record not found inside your shopping cart." });
        }

        return res.status(200).json({
            message: "Shopping cart quantities adjusted successfully.",
            updated_item: result.rows[0]
        });

    } catch (error) {
        console.error('❌ Database error during updateCartItem:', error);
        return res.status(500).json({ error: 'Internal server error updating cart quantities.' });
    }
};

// FEATURE 4: REMOVE AN ITEM FROM THE CART COMPLETELY
// Endpoint: DELETE /api/v1/cart/items/:productId
export const removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        const deleteQuery = `
            DELETE FROM cart_products
            WHERE product_id = $1 
            AND cart_id = (SELECT id FROM carts WHERE user_id = $2)
            RETURNING id;
        `;
        const result = await query(deleteQuery, [productId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Target item record not found inside your shopping cart." });
        }

        return res.status(200).json({
            message: "Item removed from shopping cart canvas successfully."
        });

    } catch (error) {
        console.error('❌ Database error during removeFromCart:', error);
        return res.status(500).json({ error: 'Internal server error removing product from cart.' });
    }
};

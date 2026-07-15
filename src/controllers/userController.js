// src/controllers/userController.js

import { query } from '../config/db.js';

// ADMIN FEATURE: BROWSE ALL REGISTERED CUSTOMERS
// Endpoint: GET /api/v1/users
export const getAllUsers = async (req, res) => {
    try {
        // Fetch a full profile ledger directory from the database
        const result = await query('SELECT id, email, first_name, last_name, is_admin, created_at FROM users ORDER BY created_at DESC;');
        
        return res.status(200).json({
            count: result.rows.length,
            users: result.rows
        });
    } catch (error) {
        console.error('❌ Database error during admin getAllUsers:', error);
        return res.status(500).json({ error: 'Internal server error retrieving user ledger directory.' });
    }
};

// ADMIN FEATURE: BROWSE INDIVIDUAL REGISTERED CUSTOMER
// Endpoint: GET /api/v1/users/:id
export const getUserById = async (req, res) => {
    const { id } = req.params; // Grabs the UUID string straight out of the URL path

    try {
        // Fetch a specific profile ledger directory from the database
        const result = await query('SELECT id, email, first_name, last_name, is_admin, created_at FROM users WHERE id = $1;', [id]);

        // If the array comes back completely empty, the requested user ID doesn't exist
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found in database.' });
        }
        
        return res.status(200).json({
            user: result.rows[0]
        });
        
    } catch (error) {
        console.error('❌ Database error during admin getAllUsers:', error);
        return res.status(500).json({ error: 'Internal server error retrieving user ledger directory.' });
    }
};

// GET /api/v1/users/me
export const getMyProfile = async (req, res) => {
    try {
        const result = await query('SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1;', [req.user.id]);
        return res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ error: 'Internal error fetching profile.' });
    }
};


// PUT /api/v1/users/profile
export const updateProfile = async (req, res) => {
    const { first_name, last_name } = req.body;
    
    if (!first_name || !last_name) {
        return res.status(400).json({ error: "Name parameters cannot be blank." });
    }

    try {
        const updateQuery = `
            UPDATE users 
            SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $3 
            RETURNING id, email, first_name, last_name;
        `;
        const result = await query(updateQuery, [first_name, last_name, req.user.id]);
        return res.status(200).json({ message: "Profile updated!", user: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error updating account." });
    }
};

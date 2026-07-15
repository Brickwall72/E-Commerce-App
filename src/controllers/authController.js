// src/controllers/authController.js

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { query } from '../config/db.js';

// FEATURE 1: USER REGISTRATION (With Secure Bcrypt Hashing)
// Endpoint: POST /api/v1/auth/register
export const registerUser = async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    // 1. Basic request body validation
    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ error: "All profile fields are required for registration." });
    }

    try {
        // 2. Defensive Uniqueness Check: Ensure email doesn't already exist
        const emailCheck = await query('SELECT id FROM users WHERE email = $1;', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(409).json({ error: "A user account with this email address already exists." });
        }

        // 3. Hash the plain text password (10 salt rounds provides modern CPU resistance)
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 4. Inject row into PostgreSQL using your clean 'id' naming style
        const insertUserQuery = `
            INSERT INTO users (email, password_hash, first_name, last_name)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, first_name, last_name, created_at;
        `;
        const newUser = await query(insertUserQuery, [email, passwordHash, first_name, last_name]);

        // 5. Send back confirmation (Omit the password hash string for security!)
        return res.status(201).json({
            message: "User profile registered successfully!",
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error('❌ Database error during user registration:', error);
        return res.status(500).json({ error: 'Internal server error processing user registry.' });
    }
};

// FEATURE 2: USER LOGIN (Verify Password Hash Matching)
// Endpoint: POST /api/v1/auth/login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password parameters are required." });
    }

    try {
        const userQuery = await query('SELECT id, email, password_hash, first_name, is_admin FROM users WHERE email = $1;', [email]);
        
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ error: "Invalid login credentials provided." });
        }

        const user = userQuery.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid login credentials provided." });
        }

        // UPGRADE: Sign an operational JSON Web Token pass that expires in 24 hours
        const token = jwt.sign(
            { id: user.id, email: user.email, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send back the signed token straight to the client testing panel
        return res.status(200).json({
            message: "Authentication successful! Access granted.",
            token: token, // Sent to the client
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                is_admin: user.is_admin
            }
        });

    } catch (error) {
        console.error('❌ Database error during user login:', error);
        return res.status(500).json({ error: 'Internal server error validating credentials.' });
    }
};

// src/routes/auth.js

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import passport from 'passport'; // 1. ADD THIS IMPORT
import '../config/passport.js'; // 2. ENSURE STRATEGY INITIALIZATION SCRIPT INCLUDED

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: New Customer Profile Account Registration
 *     description: Registers a fresh profile into the store database, validating parameters and executing modern Bcrypt password hashing to protect credentials.
 *     tags:
 *       - Authentication Module
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: A unique customer email address matrix handle.
 *                 example: "new_developer@test.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Secure plain-text password to hash inside the container.
 *                 example: "SuperSecurePassword123!"
 *               first_name:
 *                 type: string
 *                 description: Customer first name.
 *                 example: "Sam"
 *               last_name:
 *                 type: string
 *                 description: Customer last name.
 *                 example: "Brickett"
 *     responses:
 *       201:
 *         description: User profile successfully initialized and recorded to disk.
 *       400:
 *         description: Missing profile parameters or failed formatting constraints.
 *       409:
 *         description: Account creation block. The provided email address is already registered.
 *       500:
 *         description: Internal database registry computation failure.
 */
router.post('/register', registerUser);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Secure Customer Login Handshake
 *     description: Verifies customer credentials via cryptographical hash checking. Returns a signed JSON Web Token (JWT) session pass on success to unlock guarded paths.
 *     tags:
 *       - Authentication Module
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Registered profile email account address.
 *                 example: "developer@test.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Clean text user password string.
 *                 example: "my_super_secret_password123"
 *     responses:
 *       200:
 *         description: Authentication successful. Access token pass issued cleanly.
 *       400:
 *         description: Incomplete validation parameters sent over network.
 *       401:
 *         description: Verification failure. Invalid login credentials provided.
 *       500:
 *         description: Internal authentication process routing crash.
 */
router.post('/login', loginUser);

const callbackMiddleware = (req, res) => {
    const token = jwt.sign(
        { id: req.user.id, email: req.user.email, is_admin: req.user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    // Secure Broadcast: Passes the token back to your React app via a secure temporary web frame postMessage event script!
    res.send(`
        <script>
            window.opener.postMessage({ token: "${token}", user: ${JSON.stringify(req.user)} }, "http://localhost:5173");
            window.close();
        </script>
    `);
}

// A. Google Entry & Callback Lanes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login', session: false }), callbackMiddleware);

// B. GitHub Entry & Callback Lanes
router.get('/github', passport.authenticate('github', { scope: ['profile', 'email'], session: false }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: 'http://localhost:5173/login', session: false }), callbackMiddleware);

export default router;

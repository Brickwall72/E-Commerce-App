// src/routes/users.js

import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { getAllUsers, getUserById, getMyProfile, updateProfile } from '../controllers/userController.js';

const router = express.Router();

// Shortcut Route Guard: Secure every single path inside this file with JWT validation
router.use(authenticateToken);

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Browse All Registered Customers (Admin Only)
 *     description: Fetches a complete, chronological directory listing of all user accounts recorded inside the database. Requires full administrative clearance credentials.
 *     tags:
 *       - User Profile Module
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Direct ledger directory array returned successfully.
 *       401:
 *         description: Access blocked. Active session token is missing.
 *       403:
 *         description: Forbidden. Account lacks administrative privileges.
 *       500:
 *         description: Internal database communication error exception.
 */
router.get('/', requireAdmin, getAllUsers);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: View Specific User Account Details (Admin Only)
 *     description: Searches account directory rows for a single profile matching the provided UUID string parameter. Requires administrative privileges.
 *     tags:
 *       - User Profile Module
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The target account unique UUID identifier key.
 *         example: "a9b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
 *     responses:
 *       200:
 *         description: Targeted user profile data located and returned.
 *       401:
 *         description: Authentication token missing.
 *       403:
 *         description: Access forbidden. Administrative credentials required.
 *       404:
 *         description: Provided UUID string does not map to a registered user account.
 *       500:
 *         description: Internal database tracking error.
 */
router.get('/:id', requireAdmin, getUserById);

/**
 * @openapi
 * /api/v1/users/profile:
 *   get:
 *     summary: Fetch My Personal Profile
 *     description: Leverages the validated user token context payload to extract the current logged-in customer's specific registration data parameters.
 *     tags:
 *       - User Profile Module
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged-in profile data parameters extracted and returned successfully.
 *       401:
 *         description: Access blocked. Session token is missing.
 *       403:
 *         description: Provided token pass string is invalid or expired.
 *       500:
 *         description: Internal server error.
 */
router.get('/profile', getMyProfile);

/**
 * @openapi
 * /api/v1/users/profile:
 *   put:
 *     summary: Update My Personal Profile Data
 *     description: Modifies the first name and last name settings properties for the currently authenticated user profile account row.
 *     tags:
 *       - User Profile Module
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: New first name value to assign.
 *                 example: "Samuel"
 *               last_name:
 *                 type: string
 *                 description: New last name value to assign.
 *                 example: "Brickett"
 *     responses:
 *       200:
 *         description: Profile records modified and saved successfully.
 *       400:
 *         description: Name parameters cannot be blank.
 *       401:
 *         description: Authentication token missing.
 *       500:
 *         description: Internal server error updating account records.
 */
router.put('/profile', updateProfile);

export default router;

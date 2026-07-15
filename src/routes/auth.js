// src/routes/auth.js

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Route Map: Relative to the mount point in index.js
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
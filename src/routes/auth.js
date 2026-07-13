// src/routes/auth.js

import express from 'express';

const router = express.Router();

// Placeholder controller functions (We will move these to the controller file later!)
const registerPlaceholder = (req, res) => res.json({ message: "Registration endpoint is mapped!" });
const loginPlaceholder = (req, res) => res.json({ message: "Login endpoint is mapped!" });

// Route Map: Relative to the mount point in index.js
router.post('/register', registerPlaceholder);
router.post('/login', loginPlaceholder);

export default router;
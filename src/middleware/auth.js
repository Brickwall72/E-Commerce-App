// src/middleware/auth.js

import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    // 1. Extract the network authorization header payload pass
    const authHeader = req.headers['authorization'];
    
    // HTTP convention splits strings: "Bearer <token_string_here>"
    const token = authHeader && authHeader.split(' ')[1];

    // If no token exists in the header, deny access immediately
    if (!token) {
        return res.status(401).json({ error: "Access denied. Authentication token missing." });
    }

    try {
        // 2. Cryptographically verify the token pass using your secure system secret
        const verifiedPayload = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach the decrypted user identity straight onto the request object
        req.user = verifiedPayload;
        
        // 4. Move forward out of the guard wall into the controller kitchen!
        next();
        
    } catch (error) {
        console.error("❌ Token verification layer failed:", error.message);
        return res.status(403).json({ error: "Authentication token is invalid or expired." });
    }
};

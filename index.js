// index.js

import express from 'express';
import { query } from './src/config/db.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

// Upgraded relational database heartbeat endpoint
app.get('/health', async (req, res) => {
    try {
        // Query the database engine for its internal system timestamp
        const dbResult = await query('SELECT NOW();');
        
        res.json({
            status: "UP",
            message: "E-Commerce REST API is completely operational",
            database_time: dbResult.rows[0].now
        });
    } catch (error) {
        console.error("Health check database failure:", error);
        res.status(500).json({ status: "DOWN", error: "Database connectivity handshake failed" });
    }
});

app.listen(PORT, () => {
  console.log(`🚀 E-Commerce API Server listening securely on port ${PORT}`);
});
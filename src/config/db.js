// src/config/db.js

import pg from 'pg';

// Pull the connection pool class out of the postgres driver package
const { Pool } = pg;

// Configure the connection parameters dynamically from your secure .env values.
// NOTE: We route through your custom host port (5433) to bypass your native machine conflict!
const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    
    // Performance tuning parameters for enterprise scalability
    max: 20,                  // Maximum number of open clients allowed in the pool
    idleTimeoutMillis: 30000, // Close idle clients automatically after 30 seconds
    connectionTimeoutMillis: 2000, // Crash quickly (2s) if the database goes offline
});

// Operational event listener: logs internal query failures immediately to your terminal screen
pool.on('error', (err) => {
    console.error('❌ Unexpected database pool connection failure:', err);
});

// Clean export template allowing any controller file to query the database seamlessly
export const query = (text, params) => pool.query(text, params);

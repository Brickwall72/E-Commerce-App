// index.js

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import orderRoutes from './src/routes/orders.js';
import cartRoutes from './src/routes/cart.js';
import userRoutes from './src/routes/users.js';

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173', // Whitelists browser tab origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// =========================================================================
// SWAGGER OPENAPI STRUCTURAL CORE CONFIGURATION
// =========================================================================
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce REST API Core Engine',
            version: '1.0.0',
            description: 'Production-ready Node.js & PostgreSQL backend system matrix tracking users, automated shopping carts, and transactional order checkout ledgers.',
            contact: {
                name: 'Sam Brickett',
            },
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Local Developer Virtual Stack Gateway',
            },
        ],
        // Global Security Scheme definition: Injects the locked JWT Bearer Token block into Swagger UI
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your valid customer access token string to unlock restricted routes.'
                }
            }
        }
    },
    // Tells the compiler where to harvest JSDoc text comments to build route parameters
    apis: ['./src/routes/*.js'], 
};

// DEV-ONLY LAYER GUARD: Only compile and serve documentation inside local sandbox environments
if (process.env.NODE_ENV === 'development') {
    const swaggerDocs = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    console.log(`📖 Interactive API Documentation dashboard live at http://localhost:${PORT}/api-docs`);
} else {
    console.log(`🔒 SECURITY: Production thread initiated. Interactive documentation panels disabled.`);
}

// =========================================================================
// ROUTE MICROSERVICE APPLICATION MOUNTS
// =========================================================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/health', (req, res) => {
    res.json({ status: "UP", message: "E-Commerce REST API is completely operational" });
});

app.listen(PORT, () => {
    console.log(`🚀 E-Commerce API Server listening securely on port ${PORT}`);
    console.log(`📖 Interactive API Documentation dashboard live at http://localhost:${PORT}/api-docs`);
});

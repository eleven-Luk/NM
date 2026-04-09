import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';

// NM Routes import
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/NM/jobRoutes.js'
import appliRoutes from './routes/NM/appliRoutes.js'
import concernRoutes from './routes/NM/concernRoutes.js'

// Maple Routes import
import appoRoutes from './routes/Maple/AppoRoutes.js'
import sampleRoutes from './routes/Maple/sampleRoutes.js'

// Load environment variables
dotenv.config();

// Connect to database with error handling
const startServer = async () => {
    try {
        await connectDB();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

startServer();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: '*',  
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'API test route is working!', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Routes with error handling
const registerRoutes = (path, routes, name) => {
    try {
        if (routes && typeof routes === 'function') {
            app.use(path, routes);
            console.log(`✅ ${name} routes registered at ${path}`);
        } else {
            console.warn(`⚠️ ${name} routes not available at ${path}`);
        }
    } catch (error) {
        console.error(`❌ Failed to register ${name} routes:`, error.message);
    }
};

// Register all routes
registerRoutes('/api/auth', authRoutes, 'Auth');
registerRoutes('/api/jobs', jobRoutes, 'Jobs');
registerRoutes('/api/applications', appliRoutes, 'Applications');
registerRoutes('/api/concerns', concernRoutes, 'Concerns');
registerRoutes('/api/appointments', appoRoutes, 'Appointments');
registerRoutes('/api/samples', sampleRoutes, 'Samples');

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'NM x Maple API is running',
        version: '1.0.0',
        endpoints: {
            test: '/api/test',
            health: '/health',
            jobs: '/api/jobs/all',
            auth: '/api/auth/login'
        }
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false,
        message: `Route ${req.originalUrl} not found`,
        availableEndpoints: [
            '/api/test',
            '/health',
            '/api/auth/login',
            '/api/jobs/all',
            '/api/applications/getAll',
            '/api/concerns/business/nm',
            '/api/appointments/get',
            '/api/samples/all'
        ]
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('💤 Process terminated!');
    });
});
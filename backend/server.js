import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';

// NM Routes import - ALL CHANGED to start with './'
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/NM/jobRoutes.js'
import appliRoutes from './routes/NM/appliRoutes.js'
import concernRoutes from './routes/NM/concernRoutes.js'

// Maple Routes import - ALL CHANGED to start with './'
import appoRoutes from './routes/Maple/AppoRoutes.js'
import sampleRoutes from './routes/Maple/sampleRoutes.js'

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Upload middleware
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

// Add a test route to debug
app.get('/api/test', (req, res) => {
  res.json({ message: 'API test route is working!' });
});

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes NM
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', appliRoutes);
app.use('/api/concerns', concernRoutes);

// Protected Routes Maple
app.use('/api/appointments', appoRoutes);
app.use('/api/samples', sampleRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Authentication API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
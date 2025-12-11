/**
 * Reddit Mastermind Backend Server
 * Main Express application
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import { initializeGemini } from './src/services/geminiService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Gemini API
try {
  initializeGemini(process.env.GEMINI_API_KEY);
} catch (error) {
  console.error('❌ Failed to initialize Gemini API:', error.message);
  console.error('Please set GEMINI_API_KEY in your .env file');
  process.exit(1);
}

// Routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Reddit Mastermind API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      generate: 'POST /api/generate/week',
      download: 'GET /api/download/:sessionId'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Reddit Mastermind Backend Server');
  console.log('='.repeat(60));
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`✓ Gemini API: Initialized`);
  console.log('='.repeat(60) + '\n');
});

export default app;

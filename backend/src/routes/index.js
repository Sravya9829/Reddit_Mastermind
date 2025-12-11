/**
 * API Routes
 */

import express from 'express';
import { generateWeek, downloadCalendar } from '../controllers/generateController.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Reddit Mastermind API is running' });
});

// Generate calendar
router.post('/generate/week', generateWeek);

// Download calendar
router.get('/download/:sessionId', downloadCalendar);

export default router;

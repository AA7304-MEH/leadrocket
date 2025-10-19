import express from 'express';
import { generateLeads, getLeadStats, getGenerationHistory } from '../controllers/leadGenerationController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Lead generation routes
router.post('/generate', generateLeads);
router.get('/stats', getLeadStats);
router.get('/history', getGenerationHistory);

export default router;
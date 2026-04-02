import express from 'express';
import { getLeads, getLead, createLead, updateLead, deleteLead, generateLeads, draftEmail, getTopPriorityLeads, enrichLead, analyzeCompetitors } from '../controllers/leadController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Public routes (accessible by authenticated users)
router.get('/', getLeads);
router.post('/generate', generateLeads);

// Draft Email
router.post('/:id/draft-email', draftEmail);
router.get('/predictive/top', getTopPriorityLeads as any);
router.post('/:id/enrich', enrichLead as any);
router.post('/:id/analyze-competitors', analyzeCompetitors as any);

router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
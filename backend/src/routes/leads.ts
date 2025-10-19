import express from 'express';
import { getLeads, getLead, createLead, updateLead, deleteLead } from '../controllers/leadController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Public routes (accessible by authenticated users)
router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
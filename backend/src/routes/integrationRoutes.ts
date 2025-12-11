
import express from 'express';
import { getWorkflows, saveWorkflow, simulateWorkflow } from '../controllers/integrationController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/', getWorkflows as any);
router.post('/', saveWorkflow as any);
router.post('/simulate', simulateWorkflow as any);

export default router;

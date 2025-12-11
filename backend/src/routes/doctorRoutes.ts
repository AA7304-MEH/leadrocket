
import express from 'express';
import { analyzeCampaign } from '../controllers/doctorController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/analyze', analyzeCampaign as any);

export default router;

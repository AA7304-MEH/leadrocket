
import { Router } from 'express';
import { cloneCampaign, saveSequence } from '../controllers/campaignController';

const router = Router();

router.post('/clone', cloneCampaign);
router.post('/save-sequence', saveSequence as any);

export default router;

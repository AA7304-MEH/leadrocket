
import { Router } from 'express';
import {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    launchCampaign,
    pauseCampaign,
    resumeCampaign,
    getCampaignStats,
    cloneCampaign,
    saveSequence
} from '../controllers/campaignController';
import { protect } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(protect);

// Stats
router.get('/stats', getCampaignStats);

// CRUD
router.get('/', getCampaigns);
router.get('/:id', getCampaign);
router.post('/', createCampaign);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);

// Actions
router.post('/:id/launch', launchCampaign);
router.post('/:id/pause', pauseCampaign);
router.post('/:id/resume', resumeCampaign);
router.post('/clone', cloneCampaign);
router.post('/save-sequence', saveSequence as any);

export default router;

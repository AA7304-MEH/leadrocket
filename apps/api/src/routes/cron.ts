import express from 'express';
import { runCampaignCron } from '../controllers/cronController';

const router = express.Router();

router.post('/campaigns', runCampaignCron);

export default router;

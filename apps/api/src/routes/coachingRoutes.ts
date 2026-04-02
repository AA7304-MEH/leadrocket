
import express from 'express';
import { getTeamStats, getCoachingTips } from '../controllers/coachingController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect); // Protect all routes

router.get('/team-stats', getTeamStats as any);
router.get('/tips', getCoachingTips as any);

export default router;

import { Router } from 'express';
import {
    getGameStats,
    getLeaderboard,
    checkAchievement
} from '../controllers/gamificationController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/stats', protect, getGameStats);
router.get('/leaderboard', protect, getLeaderboard);
router.post('/check', protect, checkAchievement);

export default router;

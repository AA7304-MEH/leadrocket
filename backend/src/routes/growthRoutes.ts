import { Router } from 'express';
import {
    createReferralCode,
    getGrowthStats,
    trackClick
} from '../controllers/growthController';
import { protect } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/click', trackClick);

// Protected routes
router.post('/referral-code', protect, createReferralCode);
router.get('/', protect, getGrowthStats);

export default router;

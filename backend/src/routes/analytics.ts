import express from 'express';
import {
  getAdminAnalytics,
  getUserAnalytics,
  exportAnalytics,
  getLeadPerformance,
  getIndustryInsights
} from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User analytics routes
router.get('/user', getUserAnalytics);
router.get('/user/performance', getLeadPerformance);
router.get('/user/industries', getIndustryInsights);
router.get('/export', exportAnalytics);

// Admin analytics routes
router.get('/admin', authorize('admin'), getAdminAnalytics);

export default router;
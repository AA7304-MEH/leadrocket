import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserAdmin,
  deleteUserAdmin,
  getSystemHealth,
  bulkUserOperations
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Admin dashboard routes
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:userId', updateUserAdmin);
router.delete('/users/:userId', deleteUserAdmin);
router.get('/system-health', getSystemHealth);
router.post('/bulk-operations', bulkUserOperations);

export default router;
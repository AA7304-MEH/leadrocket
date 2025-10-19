import express from 'express';
import { getSubscriptions, getSubscription, createSubscription, updateSubscription, cancelSubscription } from '../controllers/subscriptionController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Public routes (accessible by authenticated users)
router.get('/', getSubscriptions);
router.get('/:id', getSubscription);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.post('/:id/cancel', cancelSubscription);

export default router;
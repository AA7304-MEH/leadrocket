import express from 'express';
import {
  createPaymentIntent,
  processPayment,
  cancelSubscription,
  getPaymentHistory,
  handleWebhook,
  getSubscriptionStatus
} from '../controllers/paymentController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public webhook endpoint (no auth required)
router.post('/webhook', handleWebhook);

// Protected routes
router.use(protect);

// Payment routes
router.post('/create-intent', createPaymentIntent);
router.post('/process', processPayment);
router.get('/history', getPaymentHistory);
router.get('/subscription-status', getSubscriptionStatus);
router.post('/cancel/:subscriptionId', cancelSubscription);

export default router;
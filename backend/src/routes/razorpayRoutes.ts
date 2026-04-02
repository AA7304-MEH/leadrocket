import { Router } from 'express';
import {
    createOrder,
    verifyPayment,
    handleRazorpayWebhook,
    getSubscription,
    cancelSubscription,
    getPaymentHistory,
    purchaseCredits
} from '../controllers/razorpayController';
import { protect } from '../middleware/auth';

const router = Router();

// Public webhook endpoint (no auth required)
router.post('/webhook', handleRazorpayWebhook);

// Protected routes
router.use(protect);

// Order & Payment
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

// Credits
router.post('/purchase-credits', purchaseCredits);

// Subscription
router.get('/subscription', getSubscription);
router.post('/cancel', cancelSubscription);

// History
router.get('/history', getPaymentHistory);

export default router;

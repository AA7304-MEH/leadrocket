import express from 'express';
import {
  sendTestEmail,
  sendWelcomeEmail,
  sendLeadReport,
  sendPaymentConfirmation,
  sendTrialReminder
} from '../controllers/emailController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Email routes
router.post('/test', sendTestEmail);
router.post('/welcome', sendWelcomeEmail);
router.post('/lead-report', sendLeadReport);
router.post('/payment-confirmation', sendPaymentConfirmation);
router.post('/trial-reminder', sendTrialReminder);

export default router;
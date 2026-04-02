import express from 'express';
import { syncLeadToCRM, bulkSyncToCRM, getCRMSyncStatus, configureCRM, getCRMConfig } from '../controllers/crmController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// CRM sync routes
router.post('/sync/:leadId', syncLeadToCRM);
router.post('/bulk-sync', bulkSyncToCRM);
router.get('/sync-status/:leadId', getCRMSyncStatus);

// CRM configuration routes
router.post('/configure', configureCRM);
router.get('/config', getCRMConfig);

export default router;
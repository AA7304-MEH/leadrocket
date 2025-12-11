
import express from 'express';
import { auditContent } from '../controllers/complianceController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.post('/audit', auditContent as any);

export default router;

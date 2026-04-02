import { Router } from 'express';
import {
    connectSender,
    getSenders,
    getSender,
    pauseSender,
    resumeSender,
    disconnectSender,
    getSenderStats,
    getDeliverability,
    runInboxTest
} from '../controllers/senderController';
import { protect } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(protect);

// CRUD
router.post('/connect', connectSender);
router.get('/', getSenders);
router.get('/:id', getSender);
router.delete('/:id', disconnectSender);

// Actions
router.post('/:id/pause', pauseSender);
router.post('/:id/resume', resumeSender);

// Stats & Deliverability
router.get('/:id/stats', getSenderStats);
router.get('/deliverability/score', getDeliverability);
router.post('/deliverability/test', runInboxTest);

export default router;

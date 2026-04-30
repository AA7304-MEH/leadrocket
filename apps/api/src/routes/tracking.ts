import express from 'express';
import { trackOpen, trackClick, unsubscribe } from '../controllers/trackingController';

const router = express.Router();

router.get('/open/:campaignId', trackOpen);
router.get('/click/:campaignId', trackClick);
router.get('/unsubscribe/:leadId', unsubscribe);

export default router;

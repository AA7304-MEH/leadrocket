
import { Router } from 'express';
import { getDeliverabilityScore } from '../controllers/deliverabilityController';

const router = Router();

router.get('/score', getDeliverabilityScore);

export default router;

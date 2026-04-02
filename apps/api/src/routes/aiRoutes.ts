import { Router } from 'express';
import { remixContent, getPredictiveScore } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/remix', protect, remixContent);
router.get('/score', protect, getPredictiveScore);

export default router;

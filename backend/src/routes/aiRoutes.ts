
import { Router } from 'express';
import { personalizeContent } from '../controllers/aiController';

const router = Router();

router.post('/personalize', personalizeContent);

export default router;

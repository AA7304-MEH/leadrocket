
import { Router } from 'express';
import { analyzeReply } from '../controllers/replyController';

const router = Router();

router.post('/analyze', analyzeReply);

export default router;

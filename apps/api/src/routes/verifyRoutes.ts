
import { Router } from 'express';
import { verifyEmails } from '../controllers/verifyController';

const router = Router();

router.post('/email', verifyEmails);

export default router;

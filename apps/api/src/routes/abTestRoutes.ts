import { Router } from 'express';
import {
    createABTest,
    getABTests,
    getABTest,
    startABTest,
    stopABTest,
    getABTestResults,
    deleteABTest
} from '../controllers/abTestController';
import { protect } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(protect);

// CRUD
router.post('/', createABTest);
router.get('/', getABTests);
router.get('/:id', getABTest);
router.delete('/:id', deleteABTest);

// Actions
router.post('/:id/start', startABTest);
router.post('/:id/stop', stopABTest);

// Results
router.get('/:id/results', getABTestResults);

export default router;

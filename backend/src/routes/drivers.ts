import express from 'express';
import { updateStatus } from '../controllers/driverController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.put('/status', protect, restrictTo('driver'), updateStatus);

export default router;
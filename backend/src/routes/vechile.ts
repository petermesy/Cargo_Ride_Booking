import express from 'express';
import { getNearbyVehicles } from '../controllers/vechileController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

// router.get('/nearby', protect, restrictTo('user'), getNearbyVehicles);
router.get('/nearby', getNearbyVehicles);
export default router;
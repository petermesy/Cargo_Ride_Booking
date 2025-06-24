import express from 'express';
import { approveDriver, createVehicle } from '../controllers/adminController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.put('/drivers/:id/approve', protect, restrictTo('admin'), approveDriver);
router.post('/vehicles', protect, restrictTo('admin'), createVehicle);

export default router;
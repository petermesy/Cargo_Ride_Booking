import express from 'express';
import { createBooking, getDriverBookings } from '../controllers/bookingController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, restrictTo('user'), createBooking);
router.get('/driver', protect, restrictTo('driver'), getDriverBookings);

export default router;
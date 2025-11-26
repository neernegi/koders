import express from 'express';
import {
  createBooking,
  getUserBookings,
  cancelBooking,
  getBooking
} from '../controllers/bookingController.js';

import { protect } from '../middleware/auth.js';
import { bookingLogger } from '../middleware/bookingLogger.js';

const router = express.Router();

router.use(protect);
router.use(bookingLogger);

router.post('/', createBooking);

router.get('/my-bookings', getUserBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

export default router;

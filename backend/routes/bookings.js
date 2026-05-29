const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  updateBookingStatus,
  exportBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(createBooking)
  .get(protect, getBookings);

router.get('/export', protect, exportBookings);

router.route('/:id')
  .put(protect, updateBookingStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const bookingController = require('../controller/bookingcontroller');
const verifyToken = require('../middleware/authmiddleware');

router.post('/create', verifyToken, bookingController.createBooking);
router.get('/hotel/:hotelId', bookingController.getBookingsByHotel);

module.exports = router;

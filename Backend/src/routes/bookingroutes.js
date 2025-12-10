const express = require('express');
const router = express.Router();
const bookingController = require('../controller/bookingcontroller');

router.post('/create', bookingController.createBooking);
router.get('/hotel/:hotelId', bookingController.getBookingsByHotel);

module.exports = router;

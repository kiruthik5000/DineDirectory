const express = require('express');
const router = express.Router();

const {getall, getByHotelId, createReview } = require('../controller/reviewcontroller')

router.get('/getall', getall);
router.get('/hotel/:hotelId', getByHotelId);
router.post('/create', createReview);
module.exports = router
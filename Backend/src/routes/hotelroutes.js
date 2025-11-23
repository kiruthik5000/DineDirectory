const express = require('express');
const router = express.Router();

// Import controllers
const {
    getall,
    getByTheme,
    getById,
    createHotel,
    updateHotel,
    deleteHotel,
    searchHotels,
    getHotelStats
} = require('../controller/hotelcontroller');

// Import middleware
const {
    validateHotelCreate,
    validateHotelUpdate,
    validateHotelQuery
} = require('../middleware/validation');

/**
 * Public routes (no authentication required)
 */
router.get('/', validateHotelQuery, getall);
router.get('/search', searchHotels);
router.get('/stats', getHotelStats);
router.get('/theme/:type', validateHotelQuery, getByTheme);
router.get('/:id', getById);
router.post('/', validateHotelCreate, createHotel);
router.put('/:id', validateHotelUpdate, updateHotel);
router.delete('/:id', deleteHotel);

module.exports = router;

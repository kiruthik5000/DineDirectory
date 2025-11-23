const Hotel = require('../models/hotels');
const APIResponse = require('../utils/response');
const CONSTANTS = require('../utils/constants');
const { logUtils } = require('../middleware/logger');

/**
 * Get all hotels with filtering and pagination
 */
const getall = async (req, res) => {
    try {
        const {
            type,
            theme,
            minRating,
            maxPrice,
            location,
            page = CONSTANTS.PAGINATION.DEFAULT_PAGE,
            limit = CONSTANTS.PAGINATION.DEFAULT_LIMIT,
            sortBy = 'rating',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { isActive: true };

        if (type) filter.type = type;
        if (theme) filter.theme = theme;
        if (minRating) filter.rating = { ...filter.rating, $gte: parseFloat(minRating) };
        if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
        if (location) filter.location = { $regex: location, $options: 'i' };

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        const hotels = await Hotel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Hotel.countDocuments(filter);

        logUtils.info('Hotels retrieved successfully', {
            count: hotels.length,
            filters: filter,
            page,
            limit,
            sortBy,
            sortOrder
        });

        APIResponse.paginated(
            res,
            hotels,
            parseInt(page),
            parseInt(limit),
            total,
            'Hotels retrieved successfully'
        );
    } catch (err) {
        logUtils.error('Error retrieving hotels:', err);
        APIResponse.error(res, 'Failed to retrieve hotels');
    }
};

/**
 * Get hotels by theme/type with pagination
 */
const getByTheme = async (req, res) => {
    try {
        const { type } = req.query;

        if (!type) {
            return APIResponse.error(res, 'Theme type is required', CONSTANTS.HTTP_STATUS.BAD_REQUEST);
        }

        const {
            page = CONSTANTS.PAGINATION.DEFAULT_PAGE,
            limit = CONSTANTS.PAGINATION.DEFAULT_LIMIT,
            sortBy = 'rating',
            sortOrder = 'desc'
        } = req.query;

        const hotels = await Hotel.findByType(type, {
            page: parseInt(page),
            limit: parseInt(limit)
        }).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });

        const total = await Hotel.countDocuments({ type, isActive: true });

        logUtils.info('Hotels retrieved by theme', {
            type,
            count: hotels.length,
            page,
            limit
        });

        APIResponse.paginated(
            res,
            hotels,
            parseInt(page),
            parseInt(limit),
            total,
            `Hotels retrieved for theme: ${type}`
        );
    } catch (err) {
        logUtils.error('Error retrieving hotels by theme:', err);
        APIResponse.error(res, 'Failed to retrieve hotels by theme');
    }
};

/**
 * Get hotel by ID
 */
const getById = async (req, res) => {
    try {
        const { id } = req.params;

        const hotel = await Hotel.findOne({ _id: id, isActive: true });

        if (!hotel) {
            return APIResponse.error(res, 'Hotel not found', CONSTANTS.HTTP_STATUS.NOT_FOUND);
        }

        logUtils.info('Hotel retrieved by ID', {
            hotelId: id,
            hotelName: hotel.name
        });

        APIResponse.success(res, hotel, 'Hotel retrieved successfully');
    } catch (err) {
        logUtils.error('Error retrieving hotel by ID:', err);

        if (err.name === 'CastError') {
            return APIResponse.error(res, 'Invalid hotel ID format', CONSTANTS.HTTP_STATUS.BAD_REQUEST);
        }

        APIResponse.error(res, 'Failed to retrieve hotel');
    }
};

/**
 * Create a new hotel
 */
const createHotel = async (req, res) => {
    try {
        const hotelData = req.body;

        const hotel = new Hotel(hotelData);
        await hotel.save();

        logUtils.info('Hotel created successfully', {
            hotelId: hotel._id,
            hotelName: hotel.name
        });

        APIResponse.success(res, hotel, 'Hotel created successfully', CONSTANTS.HTTP_STATUS.CREATED);
    } catch (err) {
        logUtils.error('Error creating hotel:', err);

        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            const value = err.keyValue[field];
            return APIResponse.error(res, `Duplicate value '${value}' for field '${field}'`, CONSTANTS.HTTP_STATUS.CONFLICT);
        }

        APIResponse.error(res, 'Failed to create hotel');
    }
};

/**
 * Update hotel
 */
const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent updates to certain fields
        delete updates.createdBy;
        delete updates.createdAt;
        delete updates.updatedAt;

        const hotel = await Hotel.findOneAndUpdate(
            { _id: id, isActive: true },
            { ...updates, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!hotel) {
            return APIResponse.error(res, 'Hotel not found', CONSTANTS.HTTP_STATUS.NOT_FOUND);
        }

        logUtils.info('Hotel updated successfully', {
            hotelId: id,
            hotelName: hotel.name,
            updatedFields: Object.keys(updates)
        });

        APIResponse.success(res, hotel, 'Hotel updated successfully');
    } catch (err) {
        logUtils.error('Error updating hotel:', err);

        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            const value = err.keyValue[field];
            return APIResponse.error(res, `Duplicate value '${value}' for field '${field}'`, CONSTANTS.HTTP_STATUS.CONFLICT);
        }

        APIResponse.error(res, 'Failed to update hotel');
    }
};

/**
 * Delete hotel (soft delete)
 */
const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;

        const hotel = await Hotel.findOneAndUpdate(
            { _id: id, isActive: true },
            { isActive: false, updatedAt: new Date() },
            { new: true }
        );

        if (!hotel) {
            return APIResponse.error(res, 'Hotel not found', CONSTANTS.HTTP_STATUS.NOT_FOUND);
        }

        logUtils.info('Hotel deleted successfully', {
            hotelId: id,
            hotelName: hotel.name
        });

        APIResponse.success(res, null, 'Hotel deleted successfully');
    } catch (err) {
        logUtils.error('Error deleting hotel:', err);
        APIResponse.error(res, 'Failed to delete hotel');
    }
};

/**
 * Search hotels by text
 */
const searchHotels = async (req, res) => {
    try {
        const { q: searchQuery, limit = 10 } = req.query;

        if (!searchQuery) {
            return APIResponse.error(res, 'Search query is required', CONSTANTS.HTTP_STATUS.BAD_REQUEST);
        }

        const hotels = await Hotel.find(
            {
                $text: { $search: searchQuery },
                isActive: true
            },
            { score: { $meta: 'textScore' } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .limit(parseInt(limit));

        logUtils.info('Hotels searched successfully', {
            searchQuery,
            count: hotels.length,
            limit
        });

        APIResponse.success(res, hotels, `Found ${hotels.length} hotels matching "${searchQuery}"`);
    } catch (err) {
        logUtils.error('Error searching hotels:', err);
        APIResponse.error(res, 'Failed to search hotels');
    }
};

/**
 * Get hotel statistics
 */
const getHotelStats = async (req, res) => {
    try {
        const stats = await Hotel.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalHotels: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    averagePrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    types: { $addToSet: '$type' },
                    themes: { $addToSet: '$theme' }
                }
            }
        ]);

        const typeStats = await Hotel.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    averagePrice: { $avg: '$price' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        logUtils.info('Hotel statistics retrieved successfully');

        APIResponse.success(res, {
            overview: stats[0] || {},
            byType: typeStats
        }, 'Hotel statistics retrieved successfully');
    } catch (err) {
        logUtils.error('Error retrieving hotel statistics:', err);
        APIResponse.error(res, 'Failed to retrieve hotel statistics');
    }
};

module.exports = {
    getall,
    getByTheme,
    getById,
    createHotel,
    updateHotel,
    deleteHotel,
    searchHotels,
    getHotelStats
};

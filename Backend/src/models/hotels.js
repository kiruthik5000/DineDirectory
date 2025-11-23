
const mongoose = require('mongoose');
const CONSTANTS = require('../utils/constants');

/**
 * Hotel Schema with comprehensive validation
 */
const HotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Hotel name is required'],
            trim: true,
            minlength: [2, 'Hotel name must be at least 2 characters long'],
            maxlength: [100, 'Hotel name cannot exceed 100 characters']
        },
        type: {
            type: String,
            required: [true, 'Hotel type is required'],
            enum: {
                values: CONSTANTS.HOTEL_THEMES,
                message: 'Invalid hotel type'
            }
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
            minlength: [5, 'Location must be at least 5 characters long'],
            maxlength: [200, 'Location cannot exceed 200 characters']
        },
        time: {
            type: String,
            required: [true, 'Operating hours are required'],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format (24-hour)']
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [0, 'Rating cannot be less than 0'],
            max: [5, 'Rating cannot be more than 5'],
            validate: {
                validator: function(value) {
                    return /^\d(\.\d)?$/.test(value.toString());
                },
                message: 'Rating must have at most one decimal place'
            }
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
            validate: {
                validator: function(value) {
                    return /^\d+(\.\d{1,2})?$/.test(value.toString());
                },
                message: 'Price can have at most two decimal places'
            }
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number (10-15 digits, optional + prefix)']
        },
        no_of_rating: {
            type: Number,
            required: [true, 'Number of ratings is required'],
            integer: true,
            min: [0, 'Number of ratings cannot be negative'],
            default: 0
        },
        theme: {
            type: String,
            required: [true, 'Theme is required'],
            enum: {
                values: CONSTANTS.HOTEL_THEMES,
                message: 'Invalid hotel theme'
            }
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
            trim: true
        },
        imageUrl: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, 'Image URL must be a valid HTTP/HTTPS URL']
        },
        isActive: {
            type: Boolean,
            default: true
        },

    },
    {
        timestamps: true, // Adds createdAt and updatedAt
        versionKey: false // Disables __v field
    }
);

/**
 * Indexes for better query performance
 */
HotelSchema.index({ type: 1 });
HotelSchema.index({ theme: 1 });
HotelSchema.index({ rating: -1 });
HotelSchema.index({ price: 1 });
HotelSchema.index({ location: 'text', name: 'text' }); // Text search index
HotelSchema.index({ isActive: 1, type: 1 }); // Compound index for active hotels by type

/**
 * Virtual for average rating calculation
 */
HotelSchema.virtual('averageRating').get(function() {
    if (this.no_of_rating === 0) return 0;
    return this.rating;
});

/**
 * Pre-save middleware to ensure data consistency
 */
HotelSchema.pre('save', function(next) {
    // Ensure theme matches type for consistency
    if (this.type && this.theme && this.type !== this.theme) {
        this.theme = this.type;
    }
    next();
});

/**
 * Static method to find active hotels
 */
HotelSchema.statics.findActive = function() {
    return this.find({ isActive: true });
};

/**
 * Static method to find hotels by type with pagination
 */
HotelSchema.statics.findByType = function(type, options = {}) {
    const { page = CONSTANTS.PAGINATION.DEFAULT_PAGE, limit = CONSTANTS.PAGINATION.DEFAULT_LIMIT } = options;
    const skip = (page - 1) * limit;

    return this.find({ type, isActive: true })
        .sort({ rating: -1, no_of_rating: -1 })
        .skip(skip)
        .limit(limit);
};

/**
 * Instance method to update rating
 */
HotelSchema.methods.updateRating = function(newRating, numberOfRatings = 1) {
    const totalRating = this.rating * this.no_of_rating;
    const newTotalRating = totalRating + newRating;
    const newNoOfRating = this.no_of_rating + numberOfRatings;

    this.rating = newNoOfRating > 0 ? newTotalRating / newNoOfRating : 0;
    this.no_of_rating = newNoOfRating;

    return this.save();
};

module.exports = mongoose.model('Hotel', HotelSchema);

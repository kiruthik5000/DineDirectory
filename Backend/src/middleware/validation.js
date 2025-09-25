const Joi = require('joi');
const APIResponse = require('../utils/response');
const CONSTANTS = require('../utils/constants');

/**
 * Validation schemas
 */
const schemas = {
  // Hotel validation schemas
  hotel: {
    create: Joi.object({
      name: Joi.string()
        .min(2)
        .max(100)
        .required(),
      type: Joi.string()
        .valid(...CONSTANTS.HOTEL_THEMES)
        .required(),
      location: Joi.string()
        .min(5)
        .max(200)
        .required(),
      time: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
          'string.pattern.base': 'Time must be in HH:MM format'
        }),
      rating: Joi.number()
        .min(0)
        .max(5)
        .precision(1)
        .required(),
      price: Joi.number()
        .min(0)
        .precision(2)
        .required(),
      phone: Joi.string()
        .pattern(/^[\+]?[1-9][\d]{0,15}$/)
        .required()
        .messages({
          'string.pattern.base': 'Please enter a valid phone number'
        }),
      no_of_rating: Joi.number()
        .integer()
        .min(0)
        .required(),
      theme: Joi.string()
        .valid(...CONSTANTS.HOTEL_THEMES)
        .required()
    }),

    update: Joi.object({
      name: Joi.string()
        .min(2)
        .max(100),
      type: Joi.string()
        .valid(...CONSTANTS.HOTEL_THEMES),
      location: Joi.string()
        .min(5)
        .max(200),
      time: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .messages({
          'string.pattern.base': 'Time must be in HH:MM format'
        }),
      rating: Joi.number()
        .min(0)
        .max(5)
        .precision(1),
      price: Joi.number()
        .min(0)
        .precision(2),
      phone: Joi.string()
        .pattern(/^[\+]?[1-9][\d]{0,15}$/)
        .messages({
          'string.pattern.base': 'Please enter a valid phone number'
        }),
      no_of_rating: Joi.number()
        .integer()
        .min(0),
      theme: Joi.string()
        .valid(...CONSTANTS.HOTEL_THEMES)
    }).min(1), // At least one field must be provided

    query: Joi.object({
      type: Joi.string()
        .valid(...CONSTANTS.HOTEL_THEMES),
      page: Joi.number()
        .integer()
        .min(1)
        .default(CONSTANTS.PAGINATION.DEFAULT_PAGE),
      limit: Joi.number()
        .integer()
        .min(1)
        .max(CONSTANTS.PAGINATION.MAX_LIMIT)
        .default(CONSTANTS.PAGINATION.DEFAULT_LIMIT)
    })
  }
};

/**
 * Generic validation middleware
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Property to validate (body, query, params)
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);

    if (error) {
      return APIResponse.validationError(res, error);
    }

    next();
  };
};

/**
 * Pre-configured validation middlewares
 */
const validateHotelCreate = validate(schemas.hotel.create, 'body');
const validateHotelUpdate = validate(schemas.hotel.update, 'body');
const validateHotelQuery = validate(schemas.hotel.query, 'query');

module.exports = {
  validate,
  validateHotelCreate,
  validateHotelUpdate,
  validateHotelQuery,
  schemas
};

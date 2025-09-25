const CONSTANTS = require('../utils/constants');
const APIResponse = require('../utils/response');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID format';
    return APIResponse.error(res, message, CONSTANTS.HTTP_STATUS.BAD_REQUEST);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate value '${value}' for field '${field}'`;
    return APIResponse.error(res, message, CONSTANTS.HTTP_STATUS.CONFLICT);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    return APIResponse.error(res, 'Validation Error', CONSTANTS.HTTP_STATUS.BAD_REQUEST, errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return APIResponse.error(res, 'Invalid token', CONSTANTS.HTTP_STATUS.UNAUTHORIZED);
  }

  if (err.name === 'TokenExpiredError') {
    return APIResponse.error(res, 'Token expired', CONSTANTS.HTTP_STATUS.UNAUTHORIZED);
  }

  // Default to 500 server error
  APIResponse.error(res, error.message || 'Internal Server Error');
};

/**
 * Handle 404 errors
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  APIResponse.error(res, error.message, CONSTANTS.HTTP_STATUS.NOT_FOUND);
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};

const CONSTANTS = require('./constants');

/**
 * Standardized API response utility
 */
class APIResponse {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {Object} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   */
  static success(res, data = null, message = 'Success', statusCode = CONSTANTS.HTTP_STATUS.OK) {
    const response = {
      success: true,
      message,
      timestamp: new Date().toISOString()
    };

    if (data !== null) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {Object} errors - Validation errors
   */
  static error(res, message = 'Internal Server Error', statusCode = CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Validation error response
   * @param {Object} res - Express response object
   * @param {Object} errors - Joi validation errors
   */
  static validationError(res, errors) {
    const formattedErrors = {};

    errors.details.forEach(error => {
      formattedErrors[error.path[0]] = error.message;
    });

    return this.error(
      res,
      'Validation failed',
      CONSTANTS.HTTP_STATUS.BAD_REQUEST,
      formattedErrors
    );
  }

  /**
   * Pagination response
   * @param {Object} res - Express response object
   * @param {Array} data - Paginated data
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} total - Total items
   * @param {string} message - Success message
   */
  static paginated(res, data, page, limit, total, message = 'Data retrieved successfully') {
    const totalPages = Math.ceil(total / limit);

    return res.status(CONSTANTS.HTTP_STATUS.OK).json({
      success: true,
      message,
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = APIResponse;

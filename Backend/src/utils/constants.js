/**
 * Application constants
 */
const CONSTANTS = {
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100 // limit each IP to 100 requests per windowMs
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // Hotel themes/types
  HOTEL_THEMES: [
    'Fine Dining',
    'Casual Dining',
    'Fast Food',
    'Cafe',
    'Buffet',
    'Bar & Grill',
    'Food Truck',
    'Bakery',
    'Dessert',
    'International'
  ]
};

module.exports = CONSTANTS;

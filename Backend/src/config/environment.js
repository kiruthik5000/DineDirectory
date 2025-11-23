require('dotenv').config();

/**
 * Environment configuration
 */
const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1'
  },

  // Database configuration
  database: {
    mongodbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/dinedirectory',
    retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS) || 3,
    retryDelay: parseInt(process.env.DB_RETRY_DELAY) || 5000
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true' || false
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.NODE_ENV !== 'production'
  }
};

/**
 * Validate required environment variables
 */
const validateConfig = () => {
  // Validate MongoDB URL format
  if (config.database.mongodbUrl && !config.database.mongodbUrl.startsWith('mongodb')) {
    throw new Error('MONGODB_URL must start with mongodb:// or mongodb+srv://');
  }
};

/**
 * Get configuration for current environment
 */
const getConfig = () => {
  validateConfig();
  return config;
};

module.exports = {
  config,
  getConfig,
  validateConfig
};

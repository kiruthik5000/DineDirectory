const winston = require('winston');
const morgan = require('morgan');

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'dine-directory-backend' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// If we're not in production then log to the console with a simple format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

/**
 * Request logging middleware using Morgan
 */
const requestLogger = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms',
  {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      }
    }
  }
);

/**
 * Custom logging utility functions
 */
const logUtils = {
  /**
   * Log info message
   */
  info: (message, meta = {}) => {
    logger.info(message, meta);
  },

  /**
   * Log error message
   */
  error: (message, error = null, meta = {}) => {
    if (error) {
      logger.error(message, { error: error.message, stack: error.stack, ...meta });
    } else {
      logger.error(message, meta);
    }
  },

  /**
   * Log warning message
   */
  warn: (message, meta = {}) => {
    logger.warn(message, meta);
  },

  /**
   * Log debug message
   */
  debug: (message, meta = {}) => {
    logger.debug(message, meta);
  },

  /**
   * Log HTTP requests with additional context
   */
  logRequest: (req, additionalInfo = {}) => {
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user.id : null,
      ...additionalInfo
    });
  },

  /**
   * Log user actions
   */
  logUserAction: (userId, action, details = {}) => {
    logger.info('User Action', {
      userId,
      action,
      ...details,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  logger,
  requestLogger,
  logUtils
};

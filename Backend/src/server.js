const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Import configurations and utilities
const { config, getConfig } = require('./config/environment');
const connectDB = require('./config/db');
const { requestLogger, logUtils } = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const APIResponse = require('./utils/response');
const CONSTANTS = require('./utils/constants');

// Import routes
const hotelroutes = require('./routes/hotelroutes');

// Initialize configuration
getConfig();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors(config.cors));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logUtils.warn('Rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    APIResponse.error(res, 'Too many requests', CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS);
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  APIResponse.success(res, {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
    version: config.server.apiVersion
  }, 'Server is healthy');
});

// API routes
app.use(`/api/${config.server.apiVersion}/hotels`, hotelroutes);

// Welcome route
app.get('/', (req, res) => {
  APIResponse.success(res, {
    message: 'Welcome to DineDirectory API',
    version: config.server.apiVersion,
    endpoints: {
      hotels: `/api/${config.server.apiVersion}/hotels`,
      health: '/health'
    }
  }, 'API is running successfully');
});

// 404 handler for undefined routes
app.use('*', notFound);

// Global error handling middleware
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logUtils.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(() => {
    logUtils.info('HTTP server closed');

    // Close database connection
    const mongoose = require('mongoose');
    mongoose.connection.close(false, () => {
      logUtils.info('MongoDB connection closed');
      process.exit(0);
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logUtils.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logUtils.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logUtils.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const PORT = config.server.port;
const server = app.listen(PORT, () => {
  logUtils.info(`Server running on port ${PORT}`, {
    environment: config.server.nodeEnv,
    apiVersion: config.server.apiVersion,
    corsOrigins: config.cors.origin
  });
});

module.exports = app;

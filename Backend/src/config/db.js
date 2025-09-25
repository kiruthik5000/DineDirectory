const mongoose = require('mongoose');
const { config } = require('./environment');
const { logUtils } = require('../middleware/logger');

/**
 * MongoDB connection with retry logic
 */
const connectDB = async (retryCount = 0) => {
    try {
        const options = {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        await mongoose.connect(config.database.mongodbUrl, options);

        logUtils.info('MongoDB connected successfully', {
            host: mongoose.connection.host,
            port: mongoose.connection.port,
            database: mongoose.connection.name
        });

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logUtils.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logUtils.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logUtils.info('MongoDB reconnected');
        });

    } catch (err) {
        logUtils.error(`MongoDB connection attempt ${retryCount + 1} failed:`, err);

        if (retryCount < config.database.retryAttempts) {
            const delay = config.database.retryDelay * Math.pow(2, retryCount); // Exponential backoff
            logUtils.info(`Retrying MongoDB connection in ${delay}ms...`);

            setTimeout(() => {
                connectDB(retryCount + 1);
            }, delay);
        } else {
            logUtils.error('Max MongoDB connection retry attempts reached. Exiting...');
            process.exit(1);
        }
    }
};

/**
 * Graceful shutdown
 */
const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        logUtils.info('MongoDB disconnected gracefully');
    } catch (err) {
        logUtils.error('Error during MongoDB disconnection:', err);
    }
};

module.exports = connectDB;

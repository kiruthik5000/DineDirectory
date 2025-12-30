const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userroutes = require('./routes/userroutes')
const hotelroutes = require('./routes/hotelroutes')
const reviewroutes = require('./routes/reviewroutes')

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: (origin, callback) => {
        // Allow no-origin requests (e.g. mobile apps, curl)
        if (!origin) return callback(null, true);

        // Check if a specific FRONTEND_URL is set
        if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }

        // For currently resolving the issue, we can allow the origin dynamically
        // Note: For strict security, you should whitelist specific domains here.
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.options('*', cors());
app.use(express.json());

// simple route

app.use('/api/users', userroutes)
app.use('/api/hotels', hotelroutes)
app.use('/api/reviews', reviewroutes)
app.use('/api/bookings', require('./routes/bookingroutes'));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))

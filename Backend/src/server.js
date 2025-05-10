const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userroutes = require('./routes/userroutes')
const hotelroutes = require('./routes/hotelroutes')

dotenv.config();
connectDB();

const app =  express();
app.use(cors())
app.use(express.json());

// simple route

app.use('/api/users', userroutes)
app.use('/api/hotels', hotelroutes)


const PORT = process.env.PORT;

app.listen(PORT, ()=>console.log(`server is running on port ${PORT}`))

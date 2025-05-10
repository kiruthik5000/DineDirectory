
const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema(
    {
        id: Number,
        name: String,
        type: String,
        location: String,
        time:String,
        rating: Number,
        price: Number,
        phone: String,
        no_of_rating: Number,
        theme:String
    }
)
module.exports =  mongoose.model('Hotel', HotelSchema);

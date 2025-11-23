const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    hotelId: {
        type: Number,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    date: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model("Reviews", ReviewSchema);

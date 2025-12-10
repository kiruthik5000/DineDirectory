const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  hotelId: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Bookingdetails", bookingSchema);

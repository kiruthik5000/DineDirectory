const mongoose = require("mongoose");
const users = require("./users");
const hotels = require("./hotels");

const bookingSchema = new mongoose.Schema({
  user: {
    type: users,
    require: true,
  },
  hotel: {
    type: hotels,
    require: true,
  },
  time: {
    type: String,
    require: true,
  },
  numberOfCustomers: {
    type: Number,
  },
});
module.exports = mongoose.model("Bookingdetails", bookingSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, // ✅ fixed spelling
    },
    email: {
      type: String,
      required: true, // ✅ fixed spelling
    },
    password: {
      type: String,
      required: true, // ✅ fixed spelling
      select: false,  // ✅ hides password from queries unless explicitly selected
    },
  },
  { versionKey: false } // ✅ disables `__v`
);
// "Userdetails" is the model name (Mongoose auto-pluralizes it to "userdetails" collection)
module.exports = mongoose.model("Userdetails", userSchema);

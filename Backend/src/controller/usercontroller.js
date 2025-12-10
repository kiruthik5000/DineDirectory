const User = require("../models/users");

const getall = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getbyName = async (req, res) => {
  try {
    const name = req.query.name;
    const user = await User.findOne({ username: name });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addUser = async (req, res) => {
  try {
    const request = req.body;

    // ✅ Await the result from is_exist
    const exists = await is_exist(request);

    if (!exists) {
      const user = new User(request);
      await user.save();
      return res.status(201).json({ user, message: "User saved successfully" });
    } else {
      return res.status(400).json({ message: "User already exists with this email" });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const jwt = require('jsonwebtoken');

const userlogin = async (req, res) => {
  try {
    // Check both body and query for backward compatibility or strict migration
    const email = req.body.email || req.query.email;
    const password = req.body.password || req.query.password;
    
    const cur_user = await User.findOne({ email: email }).select('+password');
    if (!cur_user) {
      return res.status(400).json({ message: "User does not exist. Please register first." });
    }

    // Check password
    if (password === cur_user.password) {
      // Create token
      const token = jwt.sign(
          { _id: cur_user._id, email: cur_user.email, username: cur_user.username }, 
          process.env.JWT_SECRET || 'secretKey', 
          { expiresIn: '1h' }
      );
      
      return res.status(200).json({ 
          message: "Login Successful", 
          user: cur_user,
          token: token 
      });
    }
    else {
          return res.status(401).json({ message: "Password does not match" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const is_exist = async (request) => {
  const exist_user = await User.findOne({ email: request.email });
  return !!exist_user; // Returns true if user exists, false otherwise
};

module.exports = {
  getall,
  getbyName,
  addUser,
  userlogin
};

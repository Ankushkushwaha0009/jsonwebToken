const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secretKey = "ankushkushwaha1281982ankushkushwaha";
const mongoose = require('mongoose');  // Import mongoose


const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    // console.log("Existing User:", existingUser); 
    if (existingUser) {
      return res.status(400).json({
        error: `User with email ${email} already exists. Please try a different email.`,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User Not Found ... " });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials .. " });
    }

    jwt.sign({ user }, secretKey, { expiresIn: "4000s" }, (err, token) => {
      if (err) {
        return res.status(500).json({ error: "Failed to generayte token .. " });
      }
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error ... " });
  }
};

const getProfile = async (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            return res.status(403).json({ result: "invalid token" });
        } else {
            // console.log("Decoded Token:", authData);
            const userId = new mongoose.Types.ObjectId(authData.user._id);
            User.findOne({ _id: userId })
                .then((user) => {
                    if (!user) {
                        return res.status(404).json({ result: "User not found" });
                    }
                    res.json({
                        message: "Token is Correct",
                        user: user,
                    });
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).json({ error: "Server error" });
                });
        }
    });
};

module.exports = { loginUser, registerUser, getProfile };

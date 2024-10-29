const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache"); 
const User = require("../models/User");
const router = express.Router();

const tokenCache = new NodeCache({stdTTL: 3600});

// Register Route
router.post("/register", async (req, res) => {
  const {name, email, password} = req.body;
  try {
    // Check if user exists
    let user = await User.findOne({email});
    if (user) return res.status(400).json({message: "User already exists"});

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    user = new User({name, email, password: hashedPassword});
    await user.save();

    res.status(201).json({message: "User registered successfully"});
  } catch (err) {
    res.status(500).json({error: "Server error"});
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const {email, password} = req.body;
  try {
    // Find user by email
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message: "User not found"});

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({message: "Invalid credentials"});

    // Create JWT token
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({token});
  } catch (err) {
    res.status(500).json({error: "Server error"});
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    tokenCache.set(token, true); // Add token to cache for invalidation
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    res.status(400).json({ message: "Token missing" });
  }
});

// Middleware to check token validity
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || tokenCache.has(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Example protected route
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Welcome to the protected route!", user: req.user });
});



module.exports = router;
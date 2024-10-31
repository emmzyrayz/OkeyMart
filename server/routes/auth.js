const express = require("express");
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");
const User = require("../models/User");
const router = express.Router();
const rateLimit = require("express-rate-limit");

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

router.use(limiter);

// Token blacklist cache
const tokenBlacklist = new NodeCache({stdTTL: 3600}); // 1 hour TTL

// Register Route
router.post("/register", async (req, res) => {
  try {
    const {name, email, phone, password} = req.body;

    // Check if user exists
    const existingUser = await User.findOne({email: email.toLowerCase()});
    if (existingUser) {
      return res.status(400).json({message: "Email already registered"});
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      phone,
      password,
    });

    await user.save();

    res.status(201).json({message: "Registration successful"});
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({message: "Server error during registration"});
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;

    // Find user
    const user = await User.findOne({email: email.toLowerCase()});
    if (!user) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({message: "Server error during login"});
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    tokenBlacklist.set(token, true);
    res.status(200).json({message: "Logged out successfully"});
  } else {
    res.status(400).json({message: "No token provided"});
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({message: "No token provided"});
    }

    if (tokenBlacklist.has(token)) {
      return res.status(401).json({message: "Token has been invalidated"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({message: "Token has expired"});
    }
    res.status(401).json({message: "Invalid token"});
  }
};

// Protected route example
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({message: "Server error"});
  }
});

module.exports = router;

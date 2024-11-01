const express = require("express");
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");
const User = require("../models/User");
const { encrypt } = require("../utils/encryption");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const updateRole = require("../config/roleUpdater");
const authMiddleware = require("../middleware/auth");
const resetEmail = require("../utils/email")

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

    // Encrypt email and phone
    const encryptedEmail = encrypt(email.toLowerCase());
    const encryptedPhone = encrypt(phone);

    // Create new user with encrypted data
    const user = new User({
      name,
      email: encryptedEmail,
      phone: encryptedPhone,
      password,
      role: "Buyer", // Default role
    });

    await user.save();

    // Update user role based on any criteria that might apply at registration
    await updateRole(user._id);

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

router.post("/complete-profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  user.profileCompletion = 100; // Assume profile completion is a percentage
  await user.save();

  await updateRole(user._id); // Check if role needs updating based on new profile data

  res.json({message: "Profile completed. Role may have been updated."});
});

// Route for user to submit documents (sets status to Pending)
router.post("/submit-documents", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.verificationStatus = "Pending";
    await user.save();

    res.json({ message: "Documents submitted. Verification pending." });
  } catch (error) {
    console.error("Error submitting documents:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin-only route to approve verification
router.post("/verify/:userId", authMiddleware, checkRole(["Admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verificationStatus = "Verified";
    user.role = "Verified Seller"; // Update role upon successful verification
    await user.save();

    res.json({ message: "User verification approved." });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin-only route to reject verification
router.post("/reject-verification/:userId", authMiddleware, checkRole(["Admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verificationStatus = "Rejected";
    await user.save();

    res.json({ message: "User verification rejected." });
  } catch (error) {
    console.error("Error rejecting verification:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to request password reset
router.post("/request-reset", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 3600000; // 1-hour expiration

    await user.save();

    // Send reset code via email
    const subject = "Your Password Reset Code";
    const text = `Your password reset code is: ${resetCode}`;
    await resetEmail(user.email, subject, text);

    res.json({ message: "Reset code sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Route to verify code and reset password
router.post("/reset-password", async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordCode: resetCode,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure code is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    // Hash and save the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

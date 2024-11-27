const express = require("express");
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");
const User = require("../models/User");
const {encrypt, decrypt} = require("../utils/encryption");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const updateRole = require("../config/roleUpdater");
const checkRole = require("../middleware/roleAuth");
const {
  authMiddleware,
  generateToken,
  authorizeRole,
} = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendVerificationStatusEmail,
} = require("../utils/email");

// Enhanced rate limiting
const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: {message},
    standardHeaders: true,
    legacyHeaders: false,
  });

// General rate limiter for all routes
const generalLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  "Too many requests from this IP. Please try again later."
);

// Specific rate limiters
const authLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  "Too many authentication attempts. Please try again later."
);
const resetLimiter = createLimiter(
  60 * 60 * 1000,
  3,
  "Too many reset attempts. Please try again in an hour."
);

// Constants
const RESET_CODE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds
const RESET_CODE_LENGTH = 6;

// Helper function to generate reset code
const generateResetCode = (length = RESET_CODE_LENGTH) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

router.use(generalLimiter);

// Token blacklist cache
const tokenBlacklist = new NodeCache({stdTTL: 3600, checkperiod: 600}); // 1 hour TTL

// Session validation middleware
const validateSession = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "No authentication token provided" });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ message: "Session has been invalidated" });
    }

    // Verify token and check expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ message: "Session has expired" });
    }

    // Verify user still exists and is active
    const user = await User.findById(decoded.userId)
      .select("status emailVerification.isVerified")
      .lean();

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (user.status === "suspended" || user.status === "banned") {
      return res.status(403).json({ message: "Account has been suspended" });
    }

    // Add user data to request
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid authentication token " });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Register Route
router.post("/register", generalLimiter, async (req, res) => {
  try {
    const {name, email, phone, password} = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Enhanced validation
    if (!email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({message: "Invalid email format"});
    }

    if (
      !password?.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain letters, numbers, and special characters.",
      });
    }

    // Encrypt email and check if user exists
    const encryptedEmail = encrypt(email.toLowerCase());
    const existingUser = await User.findOne({email: encryptedEmail});
    if (existingUser) {
      return res.status(400).json({message: "Email already registered"});
    }

    // Encrypt phone
    const encryptedPhone = encrypt(phone);

    // Create new user with encrypted data
    const user = new User({
      name,
      email: encryptedEmail,
      phone: encryptedPhone,
      password,
      role: "Buyer",
      emailVerification: {isVerified: false}, // Set email verification
      verificationStatus: "Not Verified",
      verificationBadge: {isVerified: false},
    });

    await user.save();

    const verificationToken = jwt.sign(
      {userId: user._id},
      process.env.JWT_SECRET,
      {expiresIn: "24h"}
    );

    user.emailVerification = {
      verificationToken,
      isVerified: false,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    await user.save();

    // Generate verification URL with the token
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationUrl);

    res
      .status(201)
      .json({message: "Registration successful. Please verify your email."});
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
});


// Email Verification Route
router.post("/verify-email", async (req, res) => {
  try {
    const {token} = req.body;

    if (!token) {
      return res.status(400).json({message: "Verification token is required"});
    }

    // Additional token validation
        if (typeof token !== "string" || token.trim() === "") {
          return res.status(400).json({message: "Invalid token format"});
        }

    try {
      // Verify the JWT token with more comprehensive error handling
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findOne({
        _id: decoded.userId,
        "emailVerification.verificationToken": token,
        "emailVerification.isVerified": false,
        "emailVerification.verificationTokenExpires": {$gt: new Date()},
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid or expired verification token",
          // Optional: Include email for client-side handling
          email: user ? decrypt(user.email) : null,
        });
      }

      // Invalidate the current verification token after successful verification
      user.emailVerification = {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
        verifiedAt: new Date(),
      };

      await user.save();

      res.json({
        message: "Email verified successfully",
        success: true,
        email: decrypt(user.email),
      });
    } catch (verifyError) {
      let errorMessage = "Invalid token";
      if (verifyError.name === "TokenExpiredError") {
        errorMessage = "Verification token has expired";
      }

      return res.status(400).json({
        message: errorMessage,
        error: verifyError.message,
      });
    }
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      message: "Server error during email verification",
      error: error.message,
    });
  }
});

// Resend Verification Route
router.post("/resend-verification", async (req, res) => {
  try {
    const {email} = req.body;
    const encryptedEmail = encrypt(email.toLowerCase());

    const user = await User.findOne({
      email: encryptedEmail,
      "emailVerification.isVerified": false,
    });

    if (!user) {
      return res.status(404).json({
        message: "No pending email verification found for this account.",
      });
    }

    // Invalidate previous verification token
    user.emailVerification.verificationToken = null;
    user.emailVerification.verificationTokenExpires = null;

    // Generate new verification token
    const newVerificationToken = jwt.sign(
      {userId: user._id},
      process.env.JWT_SECRET,
      {expiresIn: "24h"}
    );

    user.emailVerification = {
      verificationToken: newVerificationToken,
      isVerified: false,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    await user.save();

    // Generate verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${newVerificationToken}`;
    await sendVerificationEmail(email, verificationUrl);

    res.json({
      message:
        "A new verification email has been sent. Please check your inbox.",
      resent: true,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      message: "Error resending verification email",
      error: error.message,
    });
  }
});

// Login Route
router.post("/login", authLimiter, async (req, res) => {
  console.log("Raw Request Body:", JSON.stringify(req.body, null, 2));

  // Log additional request details
  console.log("Request Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Content-Type:", req.get("Content-Type"));

  // Validate request body structure
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({
      message: "Invalid request body",
      error: "Request body must be a valid JSON object",
    });
  }
 


  try {
    const {email, password} = req.body;

    // Add explicit type checking and conversion
    console.log("Email type:", typeof email);
    console.log("Email value:", email);

    if (typeof email !== "string") {
      return res.status(400).json({
        message: "Invalid email format",
        emailType: typeof email,
        emailValue: email,
      });
    }

    // Encrypt the email for comparison
    const encryptedEmail = encrypt(email.trim().toLowerCase());

    // Find user with encrypted email
    const user = await User.findOne({email: encryptedEmail});

    // verify if user exist
    if (!user) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    // Check email verification status
    if (!user.emailVerification.isVerified) {
      // Check if the existing verification token is expired
      const isTokenExpired =
        !user.emailVerification.verificationTokenExpires ||
        user.emailVerification.verificationTokenExpires < new Date();

      if (isTokenExpired) {
        // Generate a new verification token
        const newVerificationToken = jwt.sign(
          {userId: user._id},
          process.env.JWT_SECRET,
          {expiresIn: "24h"}
        );

        user.emailVerification = {
          verificationToken: newVerificationToken,
          isVerified: false,
          verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };

        await user.save();

        // Send new verification email
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${newVerificationToken}`;
        await sendVerificationEmail(email, verificationUrl);

        return res.status(403).json({
          message: "Email not verified. A new verification link has been sent.",
          resendVerification: true,
          email: email,
        });
      }

      // If token is still valid, inform the user to check their email
      return res.status(403).json({
        message:
          "Email not verified. Please check your email for the verification link.",
        verificationPending: true,
        email: email,
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, decrypt(user.email), user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: decrypt(user.email), // Decrypt the email before sending
        phone: decrypt(user.phone), // Decrypt the phone before sending
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    console.error("Complete error object:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      message: "Error Logging in",
      error: error.message,
      errorType: error.name,
    });
  }
});

// update-profile route
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const {name, email, phone} = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    if (name) user.name = name;
    if (email) user.email = encrypt(email.toLowerCase());
    if (phone) user.phone = encrypt(phone);

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: decrypt(user.email),
        phone: decrypt(user.phone),
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Server error during profile update",
      error: error.message,
    });
  }
});

// Secure logout with token invalidation
router.post("/logout", authMiddleware, (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    tokenBlacklist.set(token, true);
    res.json({ message: "Logged out successfully" });
  } else {
    res.status(400).json({ message: "No token provided" });
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
router.get("/me", validateSession, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select(
        "-password -resetPasswordCode -resetPasswordExpires -resetPasswordUsed -resetPasswordAttempts -passwordHistory"
      )
      .lean();

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // Decrypt sensitive information
    const decryptedUser = {
      ...user,
      email: decrypt(user.email),
    };

    // Update last activity
    await User.findByIdAndUpdate(
      user._id,
      {
        lastActive: new Date(),
      },
      {new: true}
    );

    // Construct comprehensive response
    const response = {
      user: {
        name: decryptedUser.name,
        email: decryptedUser.email,
        phone: decryptedUser.phone,
        role: decryptedUser.role,
        profileImage: decryptedUser.profileImage,
        verificationStatus: decryptedUser.verificationStatus,
        verificationBadge: decryptedUser.verificationBadge,
        emailVerification: decryptedUser.emailVerification,
        profileCompletion: decryptedUser.profileCompletion,
        lastLogin: decryptedUser.lastLogin,
        lastActive: decryptedUser.lastActive,
        createdAt: decryptedUser.createdAt,
        address: decryptedUser.address,
        preferences: decryptedUser.preferences,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      message: "Server error while fetching user data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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

    res.json({message: "Documents submitted. Verification pending."});
  } catch (error) {
    console.error("Error submitting documents:", error);
    res.status(500).json({message: "Server error"});
  }
});

// Admin-only route to approve verification
router.post(
  "/verify/:userId",
  authMiddleware,
  authorizeRole(["Admin"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({message: "User not found"});
      }

     user.verificationStatus = "Verified";
     user.verificationBadge.isVerified = true;
     user.verificationBadge.verifiedAt = new Date();
     user.verificationBadge.verifiedBy = req.user.userId;

      await user.save();

      await sendVerificationStatusEmail(
        decrypt(user.email),
        "Verified",
        "Your account has been verified successfully."
      );

      res.json({message: "User verification completed successfully."});
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({message: "Server error during verification"});
    }
  }
);

// Admin-only route to reject verification
router.post(
  "/reject-verification/:userId",
  authMiddleware,
  checkRole(["Admin"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({message: "User not found"});
      }

      user.verificationStatus = "Rejected";
      await user.save();

      res.json({message: "User verification rejected."});
    } catch (error) {
      console.error("Error rejecting verification:", error);
      res.status(500).json({message: "Server error"});
    }
  }
);

// Route to request password reset
router.post("/request-reset", resetLimiter, async (req, res) => {
  const {email} = req.body;

  try {
    // Input validation
    if (!email) {
      return res.status(400).json({message: "Email is required"});
    }

    // console.log(`Processing reset request for email: ${email}`);

    const {email} = req.body;
    const encryptedEmail = encrypt(email.toLowerCase());
    const user = await User.findOne({email: encryptedEmail});

    

    if (user) {
      const resetCode = user.generateResetToken();
      await user.save();
      await sendResetPasswordEmail(email, resetCode);
    }

    // Same response whether user exists or not
    res.json({
      message: "If an account exists, a reset code will be sent."
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      message: "An error occurred while processing your request",
    });
  }
});

// Route to verify code and reset password
router.post("/reset-password", async (req, res) => {
  const {email, resetCode, newPassword} = req.body;

  try {
    // console.log(`Processing password reset for email: ${email}`);

    // Input validation
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({
        message: "Email, reset code, and new password are required",
      });
    }

    const encryptedEmail = encrypt(email.toLowerCase());
    const user = await User.findOne({
      email: encryptedEmail,
      resetPasswordCode: resetCode,
      resetPasswordExpires: {$gt: Date.now()},
      resetPasswordUsed: false,
    });

    // console.log(`User found for reset:`, user ? "Yes" : "No");
    // if (user) {
    // console.log(`Reset code validation:`, {
    //   storedCode: user.resetPasswordCode,
    //   providedCode: resetCode,
    //   expires: user.resetPasswordExpires,
    //   currentTime: new Date(),
    //   isExpired: user.resetPasswordExpires < Date.now(),
    // });
    // }

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
      });
    }

    // Check password requirements
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password and reset token
    user.password = hashedPassword;
    user.resetPassword.used = true;
    user.resetPassword.attempts = 0;

    // Add to password history
    user.passwordHistory.push({
      password: hashedPassword,
      changedAt: new Date(),
    });

    // Keep only last 5 passwords in history
    if (user.passwordHistory.length > 5) {
      user.passwordHistory = user.passwordHistory.slice(-5);
    }

    await user.save();

    // console.log(`Password reset successful for user: ${updatedUser._id}`);

    res.json({message: "Password reset successful"});
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      message: "An error occurred while resetting password",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Optional: Route to verify reset code without changing password
router.post("/verify-reset-code", async (req, res) => {
  const {email, resetCode} = req.body;

  try {
    // console.log(`Verifying reset code for email: ${email}`);

    const encryptedEmail = encrypt(email.toLowerCase());
    const user = await User.findOne({
      email: encryptedEmail,
      resetPasswordCode: resetCode,
      resetPasswordExpires: {$gt: Date.now()},
      resetPasswordUsed: false,
    });

    // console.log(`Reset code verification:`, {
    //   userFound: user ? "Yes" : "No",
    //   providedCode: resetCode,
    //   storedCode: user?.resetPasswordCode,
    //   expires: user?.resetPasswordExpires,
    //   currentTime: new Date(),
    // });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
      });
    }

    // Update attempts count
    await User.findByIdAndUpdate(user._id, {
      $inc: {resetPasswordAttempts: 1},
    });

    res.json({
      message: "Reset code verified successfully",
      expiresAt: user.resetPasswordExpires,
    });
  } catch (error) {
    console.error("Reset code verification error:", error);
    res.status(500).json({
      message: "An error occurred while verifying reset code",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

router.post("/refresh-token", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({message: "User not found"});
    }

    // Generate new token
    const newToken = generateToken(user._id, decrypt(user.email));

    res.json({
      token: newToken,
      user: {
        id: user._id,
        name: user.name,
        email: decrypt(user.email),
        phone: decrypt(user.phone),
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({message: "Server error during token refresh"});
  }
});

module.exports = router;

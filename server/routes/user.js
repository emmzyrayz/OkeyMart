// routes/user.js
const express = require("express");
const auth = require("../middleware/auth"); // Import the whole module
const {decrypt} = require("../utils/encryption");
const User = require("../models/User");
const router = express.Router();

// Update the route to use the middleware from the auth object
router.get("/profile", auth.authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // Decrypt sensitive information before sending
    const decryptedEmail = decrypt(user.email);
    const decryptedPhone = decrypt(user.phone);

    res.json({
      id: user._id,
      name: user.name,
      email: decryptedEmail,
      phone: decryptedPhone,
    });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({message: "Server error"});
  }
});

module.exports = router;
const express = require("express");
const authMiddleware = require("../middleware/auth");
const {decrypt} = require("../utils/encryption"); // Import decrypt function
const User = require("../models/User");
const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
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
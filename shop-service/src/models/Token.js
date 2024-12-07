// models/Token.js
const mongoose = require("mongoose");
const {generateToken} = require("../utils/encryption");

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 24 * 60 * 60 * 1000), // 24 hours from now
      index: {expires: "0"}, // Automatically delete after expiration
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 30 * 24 * 60 * 60, // Token expires after 30 days
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Method to generate a token using user ID and email
TokenSchema.statics.generateToken = function (userId, email) {
  return generateToken(userId, email);
};

// Method to validate token
TokenSchema.statics.validateToken = async function (token, userId, email) {
  try {
    // Validate token against stored token document
    const tokenDoc = await this.findOne({
      token,
      userId,
      email: email.toLowerCase(),
    });

    if (!tokenDoc) {
      return false;
    }

    // Update last used timestamp
    tokenDoc.lastUsed = new Date();
    await tokenDoc.save();

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = mongoose.model("Token", TokenSchema);
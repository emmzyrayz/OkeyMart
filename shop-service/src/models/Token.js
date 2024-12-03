const mongoose = require("mongoose");
const crypto = require("crypto");

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
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

// Method to generate a secure token
TokenSchema.statics.generateToken = function (userId, email) {
  // Create a secure, unique token
  const tokenData = `${userId}:${email}:${Date.now()}`;
  return crypto.createHash("sha256").update(tokenData).digest("hex");
};

// Method to validate token
TokenSchema.statics.validateToken = async function (token, userId, email) {
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
};

module.exports = mongoose.model("Token", TokenSchema);

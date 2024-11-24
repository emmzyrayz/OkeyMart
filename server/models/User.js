const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");


const rolesEnum = ["Buyer", "Seller", "Verified Seller", "Premium Seller"]; // Define role types
const verificationStatusEnum = [
  "Not Verified",
  "Pending",
  "Verified",
  "Rejected",
];

// Verification badge sub-schema
const verificationBadgeSchema = new mongoose.Schema({
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  badge: {
    type: String,
    enum: ["none", "verified", "premium", "trusted"],
    default: "none",
  },
});

// Email verification sub-schema
const emailVerificationSchema = new mongoose.Schema({
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  verifiedAt: Date,
});

const UserSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true},
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    profileImage: String,
    authProvider: {
      type: String,
      required: true,
      default: "email",
    },

    // Auth & Security
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    emailVerification: emailVerificationSchema,
    passwordHistory: [
      {
        password: String,
        changedAt: Date,
      },
    ],
    resetPassword: {
      code: String,
      expires: Date,
      used: {type: Boolean, default: false},
      attempts: {type: Number, default: 0},
    },
    // Role and Status
    role: {
      type: String,
      enum: rolesEnum,
      default: "Buyer",
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: verificationStatusEnum,
      default: "Not Verified",
    },
    isPremiumSeller: {
      type: Boolean,
      default: false,
    },

    // Verification Badge
    verificationBadge: verificationBadgeSchema,

    // Profile Completion
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Additional User Metadata
    lastLogin: Date,
    lastActive: Date,
    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    createdAt: {type: Date, default: Date.now},
    resetPasswordCode: {type: String}, // Store reset code here
    resetPasswordExpires: {type: Date},
    resetPasswordCode: String,
    resetPasswordExpires: Date,
    resetPasswordUsed: Boolean,
    resetPasswordAttempts: {
      type: Number,
      default: 0,
    },
    passwordHistory: [
      {
        password: String,
        changedAt: Date,
      },
    ],
  },
  {timestamps: true}
);

// Indexes
UserSchema.index({email: 1});
UserSchema.index({verificationStatus: 1});
UserSchema.index({role: 1});
UserSchema.index({"emailVerification.verificationToken": 1});

// Password hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Add to password history before updating
    this.passwordHistory.push({
      password: hashedPassword,
      changedAt: new Date(),
    });

    // Keep only last 5 passwords in history
    if (this.passwordHistory.length > 5) {
      this.passwordHistory = this.passwordHistory.slice(-5);
    }

    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
UserSchema.methods.generateVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.emailVerification.verificationToken = verificationToken;
  this.emailVerification.verificationTokenExpires = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ); // 24 hours

  return verificationToken;
};

// Verify email method
UserSchema.methods.verifyEmail = function () {
  this.emailVerification.isVerified = true;
  this.emailVerification.verificationToken = undefined;
  this.emailVerification.verificationTokenExpires = undefined;
  this.emailVerification.verifiedAt = new Date();
};

// Generate password reset token
UserSchema.methods.generateResetToken = function () {
  // Generate a 6-digit code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  this.resetPassword = {
    code: resetCode,
    expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    used: false,
    attempts: 0,
  };

  return resetCode;
};

// Check if password exists in history
UserSchema.methods.isPasswordInHistory = async function (newPassword) {
  for (let historical of this.passwordHistory) {
    if (await bcrypt.compare(newPassword, historical.password)) {
      return true;
    }
  }
  return false;
};

module.exports = mongoose.model("User", UserSchema);

import mongoose from "mongoose";

const rolesEnum = [
  "Buyer",
  "Seller",
  "Verified Seller",
  "Premium Seller",
] as const;

const verificationStatusEnum = [
  "Not Verified",
  "Pending",
  "Verified",
  "Rejected",
] as const;

// Verification badge sub-schema
const verificationBadgeSchema = new mongoose.Schema({
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User ",
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

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true},
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {type: String, trim: true},
    profileImage: {type: String}, // Profile image
    authProvider: {type: String, required: true, default: "email"}, // Authentication provider
    password: {type: String, minlength: 8}, // Only needed if storing passwords

    // Role and Status
    role: {type: String, enum: rolesEnum, default: "Buyer", required: true},
    verificationStatus: {
      type: String,
      enum: verificationStatusEnum,
      default: "Not Verified",
    },
    isPremiumSeller: {type: Boolean, default: false}, // Flag for premium subscription

    // Verification
    emailVerification: emailVerificationSchema,
    verificationBadge: verificationBadgeSchema,

    // Additional User Metadata
    createdAt: {type: Date, default: Date.now},
    lastLogin: {type: Date},
    profileCompletion: {type: Number, default: 0, min: 0, max: 100},
    preferences: {type: mongoose.Schema.Types.Mixed, default: {}},
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
    resetPassword: {
      code: String,
      expires: Date,
      used: {type: Boolean, default: false},
      attempts: {type: Number, default: 0},
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
userSchema.index({email: 1});
userSchema.index({verificationStatus: 1});
userSchema.index({role: 1});
userSchema.index({"emailVerification.verificationToken": 1});

export default mongoose.models.User || mongoose.model("User ", userSchema);

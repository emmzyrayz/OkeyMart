const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const rolesEnum = ["Buyer", "Seller", "Verified Seller", "Premium Seller"]; // Define role types
const verificationStatusEnum = ["Pending", "Verified", "Rejected"];

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
    phone: {type: String, trim: true},
    password: {type: String, required: true, minlength: 8},
    role: {type: String, enum: rolesEnum, default: "Buyer"},
    verificationStatus: {
      type: String,
      enum: verificationStatusEnum,
      default: "Pending",
    }, // Add verification status
    isPremiumSeller: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    resetPasswordCode: {type: String}, // Store reset code here
    resetPasswordExpires: {type: Date},
    lastLogin: {type: Date},
  },
  {timestamps: true}
);

// Password hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);

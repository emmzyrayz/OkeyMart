import mongoose from "mongoose";

const rolesEnum = [
  "Buyer",
  "Seller",
  "Verified Seller",
  "Premium Seller",
] as const;
const verificationStatusEnum = ["Pending", "Verified", "Rejected"] as const;

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
    image: {type: String}, // Profile image
    authProvider: {type: String, required: true}, // Authentication provider (e.g., Google, GitHub)
    phone: {type: String, trim: true},
    password: {type: String, minlength: 8}, // Only needed if storing passwords
    role: {type: String, enum: rolesEnum, default: "Buyer"}, // Default role as Buyer
    verificationStatus: {
      type: String,
      enum: verificationStatusEnum,
      default: "Pending",
    }, // Verification stages
    isPremiumSeller: {type: Boolean, default: false}, // Flag for premium subscription
    createdAt: {type: Date, default: Date.now},
    lastLogin: {type: Date},
  },
  {timestamps: true}
);

export default mongoose.models.User || mongoose.model("User", userSchema);

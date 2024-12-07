// src/models/UserShopping.ts
const mongoose = require("mongoose");
const crypto = require("crypto");

const UserShoppingSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    viewedProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Method to generate encrypted password
UserShoppingSchema.methods.generateEncryptedPassword = function (
  email,
  id
) {
  const secret = process.env.PASSWORD_SECRET || "default_secret";
  const combinedString = `${email}:${id}:${secret}`;
  return crypto.createHash("sha256").update(combinedString).digest("hex");
};

// Static method to create or find user
UserShoppingSchema.statics.findOrCreateUser = async function (email) {
  let user = await this.findOne({email});

  if (!user) {
    user = new this({email});
    const savedUser = await user.save();

    // Generate encrypted password after saving
    savedUser.encryptedPassword = savedUser.generateEncryptedPassword(
      email,
      savedUser._id.toString()
    );
    await savedUser.save();

    return savedUser;
  }

  return user;
};

// Validate user's encrypted password
UserShoppingSchema.methods.validatePassword = function (email) {
  const generatedPassword = this.generateEncryptedPassword(
    email,
    this._id.toString()
  );
  return this.encryptedPassword === generatedPassword;
};

export default mongoose.models.UserShopping ||
  mongoose.model("UserShopping", UserShoppingSchema);
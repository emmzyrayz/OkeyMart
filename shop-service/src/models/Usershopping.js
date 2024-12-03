const mongoose = require("mongoose");

const UserShoppingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        additionalData: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    wishlist: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    viewedProducts: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    searchHistory: [
      {
        keyword: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    userActivities: [
      {
        type: {
          type: String,
          enum: ["SEARCH", "VIEW_PRODUCT", "ADD_TO_CART", "ADD_TO_WISHLIST"],
          required: true,
        },
        details: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure unique user constraint
UserShoppingSchema.index({user: 1}, {unique: true});

module.exports = mongoose.model("UserShopping", UserShoppingSchema);
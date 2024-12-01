const mongoose = require("mongoose");

const UserShoppingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
          default: 1,
        },
        additionalData: {
          type: mongoose.Schema.Types.Mixed,
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
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    searchHistory: [
      {
        keyword: String,
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
        },
        details: mongoose.Schema.Types.Mixed,
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

module.exports = mongoose.model("UserShopping", UserShoppingSchema);
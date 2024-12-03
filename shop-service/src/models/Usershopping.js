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
        productId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          default: "",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
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
    userActivities: [
      {
        type: {
          type: String,
          enum: [
            "ADD_TO_CART",
            "REMOVE_FROM_CART",
            "UPDATE_CART_QUANTITY",
            "CLEAR_CART",
            "BULK_ADD_TO_CART",
          ],
          required: true,
        },
        details: {
          type: mongoose.Schema.Types.Mixed,
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

module.exports = mongoose.model("UserShopping", UserShoppingSchema);

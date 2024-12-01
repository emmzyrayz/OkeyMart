const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middleware/auth");
const UserShopping = require("../models/usershopping"); // New model
const User = require("../models/User");

// Add to Cart
router.post("/add-to-cart", authMiddleware, async (req, res) => {
  try {
    const {product, quantity, additionalData} = req.body;
    const userId = req.user.userId;

    // Find or create user shopping document
    let userShopping = await UserShopping.findOne({user: userId});
    if (!userShopping) {
      userShopping = new UserShopping({user: userId});
    }

    // Check if product already exists in cart
    const existingCartItemIndex = userShopping.cart.findIndex(
      (item) => item.product.toString() === product._id
    );

    if (existingCartItemIndex > -1) {
      // Update existing cart item
      userShopping.cart[existingCartItemIndex].quantity += quantity;
      userShopping.cart[existingCartItemIndex].additionalData = additionalData;
    } else {
      // Add new cart item
      userShopping.cart.push({
        product: product._id,
        quantity,
        additionalData,
        addedAt: new Date(),
      });
    }

    await userShopping.save();

    res.status(200).json({
      message: "Product added to cart",
      cart: userShopping.cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res
      .status(500)
      .json({message: "Error adding to cart", error: error.message});
  }
});

// Remove from Cart
router.delete(
  "/remove-from-cart/:productId",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const productId = req.params.productId;

      const userShopping = await UserShopping.findOne({user: userId});
      if (!userShopping) {
        return res.status(404).json({message: "Shopping context not found"});
      }

      userShopping.cart = userShopping.cart.filter(
        (item) => item.product.toString() !== productId
      );

      await userShopping.save();

      res.status(200).json({
        message: "Product removed from cart",
        cart: userShopping.cart,
      });
    } catch (error) {
      console.error("Remove from cart error:", error);
      res
        .status(500)
        .json({message: "Error removing from cart", error: error.message});
    }
  }
);

// Add to Wishlist
router.post("/add-to-wishlist", authMiddleware, async (req, res) => {
  try {
    const {product} = req.body;
    const userId = req.user.userId;

    let userShopping = await UserShopping.findOne({user: userId});
    if (!userShopping) {
      userShopping = new UserShopping({user: userId});
    }

    // Prevent duplicate wishlist items
    const existingWishlistItem = userShopping.wishlist.find(
      (item) => item.product.toString() === product._id
    );

    if (!existingWishlistItem) {
      userShopping.wishlist.push({
        product: product._id,
        addedAt: new Date(),
      });
    }

    await userShopping.save();

    res.status(200).json({
      message: "Product added to wishlist",
      wishlist: userShopping.wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res
      .status(500)
      .json({message: "Error adding to wishlist", error: error.message});
  }
});

// Log User Activity
router.post("/log-activity", authMiddleware, async (req, res) => {
  try {
    const {type, details} = req.body;
    const userId = req.user.userId;

    let userShopping = await UserShopping.findOne({user: userId});
    if (!userShopping) {
      userShopping = new UserShopping({user: userId});
    }

    userShopping.userActivities.push({
      type,
      details,
      timestamp: new Date(),
    });

    // Keep only last 50 activities
    userShopping.userActivities = userShopping.userActivities.slice(-50);

    await userShopping.save();

    res.status(200).json({
      message: "Activity logged",
      activities: userShopping.userActivities,
    });
  } catch (error) {
    console.error("Log activity error:", error);
    res
      .status(500)
      .json({message: "Error logging activity", error: error.message});
  }
});

// Get User Shopping Data
router.get("/user-data", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const userShopping = await UserShopping.findOne({user: userId})
      .populate("cart.product")
      .populate("wishlist.product")
      .lean();

    if (!userShopping) {
      return res.status(200).json({
        cart: [],
        wishlist: [],
        viewedProducts: [],
        searchHistory: [],
        userActivities: [],
      });
    }

    res.status(200).json({
      cart: userShopping.cart,
      wishlist: userShopping.wishlist,
      viewedProducts: userShopping.viewedProducts,
      searchHistory: userShopping.searchHistory,
      userActivities: userShopping.userActivities,
    });
  } catch (error) {
    console.error("Fetch user shopping data error:", error);
    res
      .status(500)
      .json({message: "Error fetching shopping data", error: error.message});
  }
});

module.exports = router;
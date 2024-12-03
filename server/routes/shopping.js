const express = require("express");
const router = express.Router();
const UserShopping = require("../models/usershopping"); // New model
const Product = require("../models/products")
const User = require("../models/User");
const rateLimit = require("express-rate-limit");
const {
  authMiddleware,
  generateToken,
  authorizeRole,
} = require("../middleware/auth");

// Enhanced rate limiting
const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: {message},
    standardHeaders: true,
    legacyHeaders: false,
  });

// General rate limiter for all routes
const generalLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  "Too many requests from this IP. Please try again later."
);

// Add to Cart
router.post("/add-to-cart/:userId", generalLimiter, async (req, res) => {
  try {
    const {email, product, quantity, additionalData} = req.body;
    const userId = req.params.userId;

    console.log("Add to Cart Request:", {
      userId,
      email,
      productId: product?._id,
      quantity,
      additionalData,
    });

    // Verify user matches the authenticated user
    if (!req.user || req.user.userId !== userId) {
      console.warn("Unauthorized cart add attempt:", {
        requestUserId: userId,
        authenticatedUserId: req.user?.userId,
      });
      return res.status(403).json({message: "Unauthorized"});
    }

    // More robust product validation
    if (!product || !product._id) {
      return res.status(400).json({
        message: "Invalid product data",
        error: "Product ID is required",
      });
    }
    // Find or create user shopping document
    let userShopping = await UserShopping.findOne({user: userId});
    if (!userShopping) {
      userShopping = new UserShopping({user: userId});
    }

    // Validate product exists
    const existingProduct = await Product.findById(product._id);
    if (!existingProduct) {
      console.error("Product not found:", product._id);
      return res.status(404).json({message: "Product not found"});
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
    console.error("Add to cart error - DETAILED:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      requestBody: req.body,
      requestParams: req.params,
    });

    res.status(500).json({
      message: "Error adding to cart",
      error: error.message,
      details: {
        name: error.name,
        code: error.code,
      },
    });
  }
});

// Remove from Cart
router.delete(
  "/remove-from-cart/:userId/:productId",
  generalLimiter,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const productId = req.params.productId;
      console.log("Add to Wishlist Request:", {
        userId,
        email,
        productId: product?._id,
      });

      // More robust authentication check
      if (!req.user || req.user.userId !== userId) {
        console.warn("Unauthorized wishlist add attempt:", {
          requestUserId: userId,
          authenticatedUserId: req.user?.userId,
        });
        return res.status(403).json({message: "Unauthorized"});
      }

      // Validate product data
      if (!product || !product._id) {
        return res.status(400).json({
          message: "Invalid product data",
          error: "Product ID is required",
        });
      }

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
      console.error("Add to Wishlist Error - DETAILED:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        requestBody: req.body,
        requestParams: req.params,
      });

      res.status(500).json({
        message: "Error adding to wishlist",
        error: error.message,
        details: {
          name: error.name,
          code: error.code,
        },
      });
    }
  }
);

// Add to Wishlist
router.post(
  "/add-to-wishlist/:userId",
  authMiddleware,
  generalLimiter,
  async (req, res) => {
    try {
      const {email, product} = req.body;
      const userId = req.params.userId;

      // Verify user matches the authenticated user
      if (req.user.userId !== userId) {
        return res.status(403).json({message: "Unauthorized"});
      }

      // Validate product data
      if (!product || !product._id) {
        return res.status(400).json({
          message: "Invalid product data",
          error: "Product ID is required",
        });
      }

      // Validate product exists
      const existingProduct = await Product.findById(product._id);
      if (!existingProduct) {
        return res.status(404).json({message: "Product not found"});
      }

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
      console.error("Add to Wishlist Error:", {
        error: error.message,
        stack: error.stack,
        name: error.name,
      });

      res.status(500).json({
        message: "Error adding to wishlist",
        error: error.message,
      });
    }
  }
);

// Remove from Wishlist
router.delete(
  "/remove-from-wishlist/:userId/:productId",
  generalLimiter,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const productId = req.params.productId;
      const {email} = req.body;

      // Verify user matches the authenticated user
      if (req.user.userId !== userId) {
        return res.status(403).json({message: "Unauthorized"});
      }

      const userShopping = await UserShopping.findOne({user: userId});
      if (!userShopping) {
        return res.status(404).json({message: "Shopping context not found"});
      }

      userShopping.wishlist = userShopping.wishlist.filter(
        (item) => item.product.toString() !== productId
      );

      await userShopping.save();

      res.status(200).json({
        message: "Product removed from wishlist",
        wishlist: userShopping.wishlist,
      });
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      res.status(500).json({
        message: "Error removing from wishlist",
        error: error.message,
      });
    }
  }
);

// Add Viewed Product
router.post("/add-viewed-product/:userId", generalLimiter, async (req, res) => {
  try {
    const {email, product} = req.body;
    const userId = req.params.userId;

    // Verify user matches the authenticated user
    if (req.user.userId !== userId) {
      return res.status(403).json({message: "Unauthorized"});
    }

    // Validate product exists
    const existingProduct = await Product.findById(product._id);
    if (!existingProduct) {
      return res.status(404).json({message: "Product not found"});
    }

    let userShopping = await UserShopping.findOne({user: userId});
    if (!userShopping) {
      userShopping = new UserShopping({user: userId});
    }

    // Prevent duplicate viewed products
    const existingViewedItem = userShopping.viewedProducts.find(
      (item) => item.product.toString() === product._id
    );

    if (!existingViewedItem) {
      userShopping.viewedProducts.push({
        product: product._id,
        viewedAt: new Date(),
      });
    }

    // Keep only last 20 viewed products
    userShopping.viewedProducts = userShopping.viewedProducts.slice(-20);

    await userShopping.save();

    res.status(200).json({
      message: "Product added to viewed products",
      viewedProducts: userShopping.viewedProducts,
    });
  } catch (error) {
    console.error("Add viewed product error:", error);
    res.status(500).json({
      message: "Error adding viewed product",
      error: error.message,
    });
  }
});

// Log User Activity
router.post("/log-activity/:userId", generalLimiter, async (req, res) => {
  try {
    const {type, details} = req.body;
    const userId = req.params.userId;

    // Verify user matches the authenticated user
    if (req.user.userId !== userId) {
      return res.status(403).json({message: "Unauthorized"});
    }

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
    res.status(500).json({
      message: "Error logging activity",
      error: error.message,
    });
  }
});

// Get User Shopping Data
router.get("/user-data/:userId", generalLimiter, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Verify user matches the authenticated user
    if (req.user.userId !== userId) {
      return res.status(403).json({message: "Unauthorized"});
    }

    const userShopping = await UserShopping.findOne({user: userId})
      .populate({
        path: "cart.product",
        model: "Product",
      })
      .populate({
        path: "wishlist.product",
        model: "Product",
      })
      .populate({
        path: "viewedProducts.product",
        model: "Product",
      })
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
    res.status(500).json({
      message: "Error fetching shopping data",
      error: error.message,
    });
  }
});

// Update Entire Shopping Context
router.post("/update-context/:userId", generalLimiter, async (req, res) => {
  try {
    const {cart, wishlist, viewedProducts, searchHistory, userActivities} =
      req.body;
    const userId = req.params.userId;

    // Verify user matches the authenticated user
    if (req.user.userId !== userId) {
      return res.status(403).json({message: "Unauthorized"});
    }

    let userShopping = await UserShopping.findOne({user: userId});
    if (!userShopping) {
      userShopping = new UserShopping({user: userId});
    }

    // Update cart
    userShopping.cart = cart;

    // Update wishlist
    userShopping.wishlist = wishlist;

    // Update viewed products
    userShopping.viewedProducts = viewedProducts;

    // Update search history
    userShopping.searchHistory = searchHistory;

    // Update user activities
    userShopping.userActivities = userActivities;

    await userShopping.save();

    res.status(200).json({
      message: "Shopping context updated successfully",
    });
  } catch (error) {
    console.error("Update shopping context error:", error);
    res.status(500).json({
      message: "Error updating shopping context",
      error: error.message,
    });
  }
});

module.exports = router;
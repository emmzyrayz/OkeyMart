const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartcontrollers");
const authMiddleware = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(authMiddleware);

// Add product to cart
router.post("/add", cartController.addToCart);

// Remove product from cart
router.delete("/remove/:productId", cartController.removeFromCart);

// Update cart item quantity
router.patch(
  "/update-quantity/:productId",
  cartController.updateCartItemQuantity
);

// Get user's entire cart
router.get("/", cartController.getCart);

// Clear entire cart
router.delete("/clear", cartController.clearCart);

// Bulk add items to cart
router.post("/bulk-add", cartController.bulkAddToCart);

module.exports = router;

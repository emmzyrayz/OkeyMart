const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartcontrollers");
const authMiddleware = require("../middleware/auth");

// Apply auth middleware to all cart routes
router.use(authMiddleware);

// Add to cart
router.post("/add", CartController.addToCart);

// Get cart
router.get("/", CartController.getCart);

// Remove from cart
router.delete("/remove", CartController.removeFromCart);

// Update cart item quantity
router.patch("/update-quantity", CartController.updateCartItemQuantity);

module.exports = router;

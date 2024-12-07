// src/routes/cart.ts
import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartcontroller";
import {
  authenticateShoppingUser,
  validateShoppingUserPassword,
} from "../middleware/auth";

const router = express.Router();

// Add to cart (requires email authentication)
router.post(
  "/",
  authenticateShoppingUser,
  validateShoppingUserPassword,
  addToCart
);

// Get user's cart
router.get(
  "/",
  authenticateShoppingUser,
  validateShoppingUserPassword,
  getCart
);

// Remove from cart
router.delete(
  "/:productId",
  authenticateShoppingUser,
  validateShoppingUserPassword,
  removeFromCart
);

export default router;

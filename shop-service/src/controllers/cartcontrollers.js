const UserService = require("../services/userService");
const UserShopping = require("../models/Usershopping");

class CartController {
  static async addToCart(req, res) {
    try {
      const {email, userId, productId, name, quantity, price} = req.body;

      // Find or create user
      const user = await UserService.findOrCreateUser(email);

      // Check if product already in cart
      const existingCartItemIndex = user.cart.findIndex(
        (item) => item.productId === productId
      );

      if (existingCartItemIndex > -1) {
        user.cart[existingCartItemIndex].quantity += quantity;
      } else {
        user.cart.push({productId, name, quantity, price});
      }

      // Log user activity
      user.userActivity.push({
        type: "add_to_cart",
        details: {productId, name, quantity},
      });

      await user.save();

      res.status(200).json({
        message: "Product added to cart",
        cart: user.cart,
      });
    } catch (error) {
      res
        .status(500)
        .json({message: "Error adding to cart", error: error.message});
    }
  }

  static async getCart(req, res) {
    try {
      const {email, userId} = req.query;

      const user = await UserShopping.findOne({email});

      if (!user) {
        return res.status(404).json({message: "User not found"});
      }

      res.status(200).json({cart: user.cart});
    } catch (error) {
      res
        .status(500)
        .json({message: "Error retrieving cart", error: error.message});
    }
  }

  static async removeFromCart(req, res) {
    try {
      const {email, userId, productId} = req.body;

      // Find user
      const user = await UserShopping.findOne({email});

      if (!user) {
        return res.status(404).json({message: "User not found"});
      }

      // Remove product from cart
      const initialCartLength = user.cart.length;
      user.cart = user.cart.filter((item) => item.productId !== productId);

      // Check if item was actually removed
      if (user.cart.length === initialCartLength) {
        return res.status(404).json({message: "Product not found in cart"});
      }

      // Log user activity
      user.userActivity.push({
        type: "remove_from_cart",
        details: {productId},
      });

      await user.save();

      res.status(200).json({
        message: "Product removed from cart",
        cart: user.cart,
      });
    } catch (error) {
      res
        .status(500)
        .json({message: "Error removing from cart", error: error.message});
    }
  }

  static async updateCartItemQuantity(req, res) {
    try {
      const {email, userId, productId, quantity} = req.body;

      // Find user
      const user = await UserShopping.findOne({email});

      if (!user) {
        return res.status(404).json({message: "User not found"});
      }

      // Find and update cart item
      const cartItemIndex = user.cart.findIndex(
        (item) => item.productId === productId
      );

      if (cartItemIndex === -1) {
        return res.status(404).json({message: "Product not found in cart"});
      }

      // Update quantity, ensure it's at least 1
      user.cart[cartItemIndex].quantity = Math.max(1, quantity);

      // Log user activity
      user.userActivity.push({
        type: "update_cart_quantity",
        details: {productId, quantity: user.cart[cartItemIndex].quantity},
      });

      await user.save();

      res.status(200).json({
        message: "Cart item quantity updated",
        cart: user.cart,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error updating cart item quantity",
          error: error.message,
        });
    }
  }
}

module.exports = CartController;
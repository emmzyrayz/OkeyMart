// src/controllers/cartController.ts
import {Request, Response} from "express";
import UserShopping from "../models/Usershopping";
import Product from "../models/product"; // Adjust the import path as needed

export const addToCart = async (req, res) => {
  try {
    const {productId, quantity = 1} = req.body;
    const user = req.shoppingUser;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({error: "Product not found"});
    }

    // Check if product already in cart
    const existingCartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      user.cart.push({
        productId,
        name: product.name,
        quantity,
        price: product.price,
      });
    }

    // Update last activity
    user.lastActivity = new Date();

    await user.save();

    res.status(200).json({
      message: "Product added to cart",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({error: "Failed to add product to cart"});
  }
};

export const getCart = async (req, res) => {
  try {
    const user = req.shoppingUser;
    res.status(200).json(user.cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({error: "Failed to retrieve cart"});
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const {productId} = req.params;
    const user = req.shoppingUser;

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    user.lastActivity = new Date();
    await user.save();

    res.status(200).json({
      message: "Product removed from cart",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({error: "Failed to remove product from cart"});
  }
};
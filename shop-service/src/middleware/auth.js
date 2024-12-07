// src/middleware/auth.ts
import {Request, Response, NextFunction} from "express";
import UserShopping from "../models/Usershopping";
import crypto from "crypto";

export const authenticateShoppingUser = async (
  req,
  res,
  next
) => {
  try {
    const email =
      req.body.email || req.query.email || req.headers["x-user-email"];

    if (!email) {
      return res.status(400).json({error: "User email is required"});
    }

    // Find or create user
    const user = await UserShopping.findOrCreateUser(email);

    // Generate a temporary token for this session
    const token = crypto.randomBytes(16).toString("hex");

    // Store token in memory or redis (for production)
    const sessionKey = `shopping_session:${email}:${token}`;

    // Set expiration for the session (e.g., 30 minutes)
    // In a real-world scenario, use Redis or another session store
    const sessionData = {
      userId: user._id,
      email: user.email,
      createdAt: Date.now(),
    };

    // Attach user and session to request
    req.shoppingUser = user;
    req.shoppingSession = {token, data: sessionData};

    next();
  } catch (error) {
    console.error("Shopping authentication error:", error);
    res.status(500).json({error: "Authentication failed"});
  }
};

// Middleware to validate user's encrypted password
export const validateShoppingUserPassword = async (
  req,
  res,
  next
) => {
  try {
    const {email} = req.body;
    const user = await UserShopping.findOne({email});

    if (!user) {
      return res.status(404).json({error: "User not found"});
    }

    // Validate the password
    if (!user.validatePassword(email)) {
      return res.status(401).json({error: "Unauthorized"});
    }

    req.shoppingUser = user;
    next();
  } catch (error) {
    console.error("Shopping password validation error:", error);
    res.status(500).json({error: "Validation failed"});
  }
};

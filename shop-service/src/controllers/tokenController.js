const Token = require("../models/Token");

exports.createToken = async (req, res) => {
  try {
    const {userId, email} = req.body;

    if (!userId || !email) {
      return res.status(400).json({
        message: "User ID and email are required",
        code: "INVALID_INPUT",
      });
    }

    // Remove any existing tokens for this user
    await Token.deleteMany({userId});

    // Generate new token
    const tokenString = Token.generateToken(userId, email);

    // Create new token document
    const newToken = new Token({
      userId,
      email,
      token: tokenString,
    });

    await newToken.save();

    res.status(201).json({
      message: "Token created successfully",
      token: tokenString,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating token",
      error: error.message,
    });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const {token, userId, email} = req.body;

    const isValid = await Token.validateToken(token, userId, email);

    res.status(200).json({
      isValid,
      message: isValid ? "Token is valid" : "Token is invalid",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error validating token",
      error: error.message,
    });
  }
};

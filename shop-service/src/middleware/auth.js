const Token = require("../models/Token");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    const userId = req.headers["x-user-id"];
    const userEmail = req.headers["x-user-email"];

    if (!token || !userId || !userEmail) {
      return res.status(401).json({
        message: "Authentication credentials missing",
        code: "AUTH_CREDENTIALS_MISSING",
      });
    }

    // Validate token
    const isValidToken = await Token.validateToken(token, userId, userEmail);

    if (!isValidToken) {
      return res.status(401).json({
        message: "Invalid or expired token",
        code: "TOKEN_INVALID",
      });
    }

    // Attach user info to request
    req.user = {id: userId, email: userEmail};
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed",
      code: "AUTH_FAILED",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;

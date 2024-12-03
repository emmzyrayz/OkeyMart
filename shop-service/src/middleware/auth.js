const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust path as needed

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        code: "TOKEN_MISSING",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
        code: "TOKEN_INVALID",
      });
    }

    // Check user account status
    if (user.status !== "active") {
      return res.status(403).json({
        message: "Account is not active",
        code: "ACCOUNT_INACTIVE",
        details: {
          status: user.status,
        },
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    res.status(401).json({
      message: "Authentication failed",
      code: "AUTH_FAILED",
    });
  }
};

module.exports = authMiddleware;
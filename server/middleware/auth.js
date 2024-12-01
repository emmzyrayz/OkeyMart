// middleware/auth.js
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");
const User = require("../models/User");

// Token management
const activeTokens = new NodeCache();
const TOKEN_EXPIRY = 30 * 60; // 30 minutes in seconds
const GRACE_PERIOD = 2 * 60; // 2 minutes grace period

const generateToken = (userId, email, role) => {
  const token = jwt.sign({userId, email, role}, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });

  const tokenData = {
    token,
    expiryTime: Date.now() + TOKEN_EXPIRY * 1000,
    lastActivity: Date.now(),
  };

  activeTokens.set(userId.toString(), tokenData);
  return token;
};

const updateTokenActivity = (userId) => {
  const tokenData = activeTokens.get(userId.toString());
  if (tokenData) {
    tokenData.lastActivity = Date.now();
    activeTokens.set(userId.toString(), tokenData);
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    // Log incoming request details
    console.log("Auth Middleware Incoming Request:", {
      headers: req.headers,
      body: req.body,
      method: req.method,
      url: req.url,
    });

    // 1. Token Extraction and Basic Validation
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        error: true,
        message: "No token provided",
        code: "TOKEN_MISSING",
      });
    }

    // 2. Token Verification
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          error: true,
          message: "Token has expired",
          code: "TOKEN_EXPIRED",
        });
      }
      return res.status(401).json({
        error: true,
        message: "Invalid token format",
        code: "TOKEN_INVALID",
      });
    }

    // 3. Active Token Verification
    const activeToken = activeTokens.get(decoded.userId);
    if (!activeToken || activeToken.token !== token) {
      return res.status(401).json({
        error: true,
        message: "Token has been revoked or replaced",
        code: "TOKEN_REVOKED",
      });
    }

    // 4. Real-time User Verification
    const user = await User.findById(decoded.userId).select(
      "role status email isActive"
    );
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "User no longer exists",
        code: "USER_NOT_FOUND",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: true,
        message: "User account is disabled",
        code: "ACCOUNT_DISABLED",
      });
    }

    // 5. Update Last Activity
    updateTokenActivity(decoded.userId);

    // 6. Attach User Info to Request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: user.role, // Use current role from database
      status: user.status,
      tokenData: {
        issuedAt: new Date(decoded.iat * 1000),
        expiresAt: new Date(decoded.exp * 1000),
      },
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
    });

    res.status(401).json({
      error: true,
      message: "Authentication failed",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
};

// Role authorization middleware
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        error: true,
        message: "Access denied - Role information not available",
        code: "ROLE_MISSING",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: true,
        message: "Access denied - Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS",
        requiredRoles: allowedRoles,
        currentRole: req.user.role,
      });
    }

    next();
  };
};

// Token management functions
const revokeToken = (userId) => {
 return activeTokens.del(userId.toString());
};

const refreshToken = async (userId) => {
  const user = await User.findById(userId).select('email role');
  if (!user) return null;
  
  return generateToken(userId, user.email, user.role);
};

// Cleanup expired tokens and inactive sessions
setInterval(() => {
  const now = Date.now();
  activeTokens.keys().forEach(userId => {
    const tokenData = activeTokens.get(userId);
    const inactiveTime = now - tokenData.lastActivity;
    
    if (now > tokenData.expiryTime + (GRACE_PERIOD * 1000) || 
        inactiveTime > (TOKEN_EXPIRY + GRACE_PERIOD) * 1000) {
      activeTokens.del(userId);
    }
  });
}, 60000); // Check every minute

module.exports = {
  authMiddleware,
  generateToken,
  authorizeRole,
  revokeToken,
  refreshToken,
  activeTokens,
};
// middleware/auth.js
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");
const User = require("../models/User");

// Token management
const activeTokens = new NodeCache();
const TOKEN_EXPIRY = 30 * 60; // 30 minutes in seconds
const GRACE_PERIOD = 2 * 60; // 2 minutes grace period

const generateToken = (userId, email) => {
  const token = jwt.sign({userId, email}, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });

  const tokenData = {
    token,
    expiryTime: Date.now() + TOKEN_EXPIRY * 1000,
    lastActivity: Date.now(),
  };

  activeTokens.set(userId, tokenData);
  return token;
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({message: "No token provided"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({message: "User not found"});
    }

    req.user = {
      userId: user._id,
      email: decrypt(user.email),
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({message: "Invalid token"});
  }
};

// async function authMiddleware(req, res, next) {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({message: "No token, authorization denied"});
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded Token:", decoded);
//     const activeToken = activeTokens.get(decoded.userId);
//     console.log("Active Token Data:", activeToken);

//     if (!activeToken || activeToken.token !== token) {
//       return res.status(401).json({message: "Token is not valid"});
//     }

//     // Update last activity time
//     activeToken.lastActivity = Date.now();
//     activeTokens.set(decoded.userId, activeToken);

//     // Fetch user with role information
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(401).json({message: "User not found"});
//     }

//     // Attach complete user object to request
//     req.user = {
//       userId: decoded.userId,
//       email: decoded.email,
//       role: user.role,
//       verificationStatus: user.verificationStatus,
//     };

//     next();
//   } catch (err) {
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token has expired' });
//     }
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// }

// Role authorization middleware
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        message: 'Access denied - Role information not available' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied - Insufficient permissions' 
      });
    }

    next();
  };
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
  authMiddleware: authMiddleware,
  generateToken: generateToken,
  activeTokens: activeTokens,
  authorizeRole: authorizeRole,
};
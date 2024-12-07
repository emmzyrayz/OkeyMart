const UserService = require("../services/userService");

const authMiddleware = async (req, res, next) => {
  try {
    const {email, userId} = req.body;

    if (!email || !userId) {
      return res.status(400).json({message: "Email and User ID required"});
    }

    const isVerified = await UserService.verifyUser(email, userId);

    if (!isVerified) {
      return res.status(401).json({message: "Unauthorized"});
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({message: "Authentication error", error: error.message});
  }
};

module.exports = authMiddleware;

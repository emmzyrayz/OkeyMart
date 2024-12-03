const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartcontrollers");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

router.post("/add", cartController.addToCart);
// Add other cart-related routes

module.exports = router;

const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/tokenController");

router.post("/create", tokenController.createToken);
router.post("/validate", tokenController.validateToken);

module.exports = router;
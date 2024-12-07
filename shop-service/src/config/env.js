require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3002,
  MONGODB_URI: process.env.MONGODB_URI,
  PASSWORD_SECRET_KEY: process.env.JWT_SECRET,
};
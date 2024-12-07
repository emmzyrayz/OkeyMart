const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");
const {PORT} = require("./config/env");

// Routes
const cartRoutes = require("./routes/cart");
// const wishlistRoutes = require("./routes/wishlist");
// const viewedProductsRoutes = require("./routes/viewed-products");
// const userActivityRoutes = require("./routes/user-activity");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","), // Comma-separated list of allowed origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Security middlewares
app.use(helmet());
app.use(express.json({limit: "10kb"}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection
connectDB();

// Routes
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/viewed-products", viewedProductsRoutes);
app.use("/api/user-activity", userActivityRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Shopping Service running on port ${PORT}`);
});

module.exports = app;

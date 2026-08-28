const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet"); // Recommended for security
const rateLimit = require("express-rate-limit"); 
const productRoutes = require("./routes/productRoutes");
const populateRoutes = require("./routes/populate/populate");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const shoppingRoutes = require("./routes/shopping");

dotenv.config(); // Load environment variables

const app = express();

// At the start of your application
// console.log('Encryption key status:', process.env.ENCRYPTION_KEY ? 'Set' : 'Not set');
// console.log('Encryption key length:', Buffer.from(process.env.ENCRYPTION_KEY, 'base64').length, 'bytes');

// Add this line before other middleware
app.set('trust proxy', 1);  // Add this line to trust the proxy

// Allowed origins (consider moving to environment variables)
const allowedOrigins = [
  "http://localhost:3000", 
  "https://okeymart.vercel.app",
  process.env.FRONTEND_URL // Add your frontend URL from .env
  const frontendUrl = process.env.FRONTEND_URL;
  if (frontendUrl && !allowedOrigins.includes(frontendUrl)) {
    allowedOrigins.push(frontendUrl);
  }
].filter(Boolean); // Remove any undefined values

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6000, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});

// CORS configuration for Render deployment
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
  credentials: true,
};



// Middleware
app.use(helmet()); // Add security headers
app.use(globalLimiter); // Apply global rate limiting
app.use(cors(corsOptions));
// app.use(express.json());
app.use(
  express.json({
    limit: "10mb", // Limit payload size
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// Optional: Add error handling for CORS errors
app.use((err, req, res, next) => {
  console.error("CORS Error:", err);
  
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      message: 'CORS error: Origin not allowed',
      error: err.message
    });
  } else {
    next(err);
  }
});

// Connect to MongoDB
connectDB();

app.use("/api/products", productRoutes); // Your existing product routes
app.use("/api", populateRoutes); // Add the populate route
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shopping", shoppingRoutes);

// Health check endpoint for deployment platforms
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 10000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Allowed origins:", allowedOrigins.join(', '));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

module.exports = app;
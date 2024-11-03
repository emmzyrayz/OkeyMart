const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const populateRoutes = require("./routes/populate/populate");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

dotenv.config(); // Load environment variables

const app = express();

// At the start of your application
// console.log('Encryption key status:', process.env.ENCRYPTION_KEY ? 'Set' : 'Not set');
// console.log('Encryption key length:', Buffer.from(process.env.ENCRYPTION_KEY, 'base64').length, 'bytes');

// Add this line before other middleware
app.set('trust proxy', 1);  // Add this line to trust the proxy

const allowedOrigins = ["http://localhost:3000", "https://okeymart.vercel.app"];

console.log("Received token:", req.header("Authorization"));

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
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};


// Connect to MongoDB
connectDB();

app.use(cors(corsOptions));
app.use(express.json());

// Optional: Add error handling for CORS errors
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      message: 'CORS error: Origin not allowed',
      error: err.message
    });
  } else {
    next(err);
  }
});

app.use("/api/products", productRoutes); // Your existing product routes
app.use("/api", populateRoutes); // Add the populate route
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Allowed origins:", allowedOrigins);
});
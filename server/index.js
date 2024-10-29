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
app.use(express.json()); // To parse JSON data

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes); // Your existing product routes
app.use("/api", populateRoutes); // Add the populate route
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

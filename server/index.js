const express = require("express");
import express from 'express';
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const populateRoutes = require("./routes/populate/populate")

dotenv.config(); // Load environment variables


const app = express();
app.use(express.json()); // To parse JSON data

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes); // Your existing product routes
app.use("/api", populateRoutes); // Add the populate route


const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

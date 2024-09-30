const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");

dotenv.config(); // Load environment variables


const app = express();
app.use(express.json()); // To parse JSON data

// Connect to MongoDB
connectDB();

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

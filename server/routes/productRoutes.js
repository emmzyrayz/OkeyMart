const express = require("express");
const Product = require("../models/products");
const mongoose = require("mongoose");
const faker = require("@faker-js/faker");
const router = express.Router();
const cors = require("cors");

// Enable CORS for specific origins
router.use(cors({
  origin: ["http://localhost:3000", "https://okeymart.onrender.com"], // Replace with your frontend domains
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Route: Populate database with fake products
router.post("/populate", async (req, res) => {
  const fakeProducts = [];

  // Create a number of fake products
  for (let i = 0; i < 10; i++) { // Adjust the number as needed
    fakeProducts.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      mainImage: faker.image.imageUrl(),
      images: [faker.image.imageUrl(), faker.image.imageUrl()],
      countInStock: Math.floor(Math.random() * 100),
      category: faker.commerce.department(),
    });
  }

  try {
    await Product.insertMany(fakeProducts); // Insert fake products into the database
    res.status(201).json({ message: "Products populated successfully", fakeProducts });
  } catch (error) {
    console.error("Error populating products:", error);
    res.status(500).json({ message: "Error populating products", error });
  }
});


// Route: Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.json(products);
  } catch (error) {
    res.status(500).json({message: "Error fetching products", error});
  }
});

// Route: Fetch a product by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({message: "Product not found"});
    }
  } catch (error) {
    res.status(500).json({message: "Error fetching product", error});
  }
});

// Route: Add a new product
router.post("/", async (req, res) => {
  const {name, description, price, mainImage, images, countInStock, category} =
    req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      mainImage,
      images,
      countInStock,
      categories: category,
    });

    const createdProduct = await product.save(); // Save product to the database
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({message: "Error creating product", error: error.message});
  }
});

// Route: Update a product
router.put("/:id", async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message: "Invalid product ID"});
    }

  const {name, description, price, imageUrl, countInStock, category} = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.images = images || product.images;
      product.mainImage = mainImage || product.mainImage;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;

      const updatedProduct = await product.save(); // Update and save product
      res.json(updatedProduct);
    } else {
      res.status(404).json({message: "Product not found"});
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({message: "Error updating product", error: error.message});
  }
});

// Route: Delete a product
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({message: "Invalid product ID"});
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (deletedProduct) {
      res.json({message: "Product removed"});
    } else {
      res.status(404).json({message: "Product not found"});
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({message: "Error deleting product", error: error.message});
  }
});

// Delete all products
router.delete("/", async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: "All products deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting products", error });
  }
});



module.exports = router;
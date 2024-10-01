const express = require("express");
const Product = require("../../models/products");
const mongoose = require("mongoose");
const faker = require("@faker-js/faker"); // Ensure faker is installed: npm install faker

const router = express.Router();

// Route: Populate database with fake products
router.post("/populate", async (req, res) => {
  const fakeProducts = [];

  // Create a number of fake products
  for (let i = 0; i < 10; i++) {
    // Adjust the number as needed
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
    res
      .status(201)
      .json({message: "Products populated successfully", fakeProducts});
  } catch (error) {
    console.error("Error populating products:", error);
    res.status(500).json({message: "Error populating products", error});
  }
});

module.exports = router;

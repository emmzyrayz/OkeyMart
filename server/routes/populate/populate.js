const express = require("express");
const Product = require("../../models/products");
const mongoose = require("mongoose");
const {faker} = require("@faker-js/faker"); // Ensure faker is installed: npm install @faker-js/faker

const router = express.Router();

// Route: Populate database with fake products
router.post("/populate", async (req, res) => {
  const products = [];

  // Categories and conditions for product generation
  const categories = [
    {
      main: "Electronics",
      sub: [
        "Gadgets",
        "Mobile Devices",
        "Smartphones",
        "Apple",
        "Watches",
        "Camera",
        "Mouse",
        "Drives",
      ],
    },
    {main: "Home Appliances", sub: ["Kitchen", "Cleaning", "Heating"]},
    {main: "Computers", sub: ["Laptops", "Desktops", "Tablets", "Accessories"]},
    {
      main: "Beauty & Personal Care",
      sub: ["Face Cream", "Hand Cream", "Soap", "Hair Cream"],
    },
    // Add more categories and subcategories as needed
  ];

  const conditions = ["New", "Refurbished", "Used"];

  // Create 100 fake products
  for (let i = 0; i < 100; i++) {
    // Select random main category and subcategories
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subCategories = faker.helpers.arrayElements(category.sub, 3); // Select up to 3 subcategories

    // Generate product filters
    const filters = {
      color: faker.color.human(), // Random color
      ram: `${faker.number.int({min: 2, max: 16})} GB`, // Random RAM size
      rom: `${faker.number.int({min: 32, max: 512})} GB`, // Random ROM size
      condition: faker.helpers.arrayElement(conditions), // Random condition
    };

    // Generate random images
    const images = Array.from({length: 5}, () => faker.image.avatar());
    const mainImage = faker.helpers.arrayElement(images); // Pick one main image

    // Add product to the array
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()), // Convert to float
      countInStock: faker.number.int({min: 0, max: 100}), // Random stock count
      images, // Array of 5 images
      mainImage, // Main image
      category: [category.main, ...subCategories], // Main category and subcategories
      filters, // Product filters
      createdAt: new Date(),
      discount: faker.number.int({min: 0, max: 50}), // Random discount
      featured: faker.datatype.boolean(),
      trending: faker.datatype.boolean(),
      top: faker.datatype.boolean(),
      today: faker.datatype.boolean(),
      rating: parseFloat(faker.number.float({min: 0, max: 5, precision: 0.1})), // Random rating
      liked: faker.datatype.boolean(),
      viewed: faker.datatype.boolean(),
    });
  }

  // Insert products into the database
  try {
    await Product.insertMany(products);
    res
      .status(201)
      .json({message: "Products populated successfully", products});
  } catch (error) {
    console.error("Error populating products:", error);
    res.status(500).json({message: "Error populating products", error});
  }
});

module.exports = router;
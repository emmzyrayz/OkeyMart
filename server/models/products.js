const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  images: {
    type: [String], // Array of image URLs
    required: true,
    validate: {
      validator: function (value) {
        return value.length === 5; // Ensure there are exactly 5 images
      },
      message: "There must be exactly 5 images",
    },
  },
  mainImage: {
    type: String, // This will store the URL of the main image
    required: true,
    validate: {
      validator: function (value) {
        return this.images.includes(value); // Ensure the mainImage is one of the 5 images
      },
      message: "Main image must be one of the product images",
    },
  },
  categories: {
    type: [
      {
        name: {type: String, required: true}, // e.g., Electronics, Mobile Device, etc.
        subcategories: [String], // e.g., Gadgets, Apple (brand), etc.
      },
    ],
    required: true,
  },
  filters: {
    color: {type: [String], required: false}, // e.g., ["Black", "White"]
    ram: {type: [String], required: false}, // e.g., ["8GB", "16GB"]
    rom: {type: [String], required: false}, // e.g., ["128GB", "256GB"]
    condition: {
      type: String, // e.g., "New", "Refurbished", "Used"
      enum: ["New", "Refurbished", "Used"],
      required: false,
    },
    otherFeatures: [String], // Add any other filterable options (optional)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  discount: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  trending: {
    type: Boolean,
    default: false,
  },
  top: {
    type: Boolean,
    default: false,
  },
  today: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  viewed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Product", ProductSchema);

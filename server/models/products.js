// models/product.js
const mongoose = require("mongoose");

const DynamicFieldsSchema = new mongoose.Schema(
  {
    fieldValues: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {strict: false}
);

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, "Stock cannot be negative"],
  },
  images: {
    type: [String],
    required: [true, "Images are required"],
    validate: {
      validator: function (value) {
        return value.length === 5;
      },
      message: "There must be exactly 5 images",
    },
  },
  mainImage: {
    type: String,
    required: [true, "Main image is required"],
    validate: {
      validator: function (value) {
        return this.images.includes(value);
      },
      message: "Main image must be one of the product images",
    },
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      "Agriculture & Food",
      "Babies & Kid",
      "Commercial Equipment & Tools",
      "Electronics",
      "Fashion",
      "Health & Beauty",
      "Home Appliances & Furniture",
      "Jobs",
      "Pets",
      "Phones & Tablets",
      "Property",
      "Repair & Construction",
      "Seeking Work CVs",
      "Services",
      "Sports, Arts and Outdoors",
      "Vehicles",
    ],
  },
  subcategory: {
    type: String,
    required: [true, "Subcategory is required"],
    trim: true,
  },
  categorySpecificFields: DynamicFieldsSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot exceed 100%"],
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
    min: [0, "Rating cannot be less than 0"],
    max: [5, "Rating cannot exceed 5"],
    default: 0,
  },
  video: {
    type: String,
    trim: true,
  },
  youtubeLink: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    required: [true, "State is required"],
    trim: true,
  },
  lga: {
    type: String,
    required: [true, "LGA is required"],
    trim: true,
  },
  bulkNumber: {
    type: String,
    trim: true,
  },
  bulkPrice: {
    type: String,
    trim: true,
  },
});

// Add the indexes
ProductSchema.index({category: 1, subcategory: 1});
ProductSchema.index({featured: 1, createdAt: -1});
ProductSchema.index({trending: 1, createdAt: -1});
ProductSchema.index({top: 1, createdAt: -1});
ProductSchema.index({today: 1, createdAt: -1});

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

module.exports = Product;

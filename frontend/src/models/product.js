// models/product.js
import mongoose from "mongoose";

const DynamicFieldsSchema = new mongoose.Schema(
  {
    // This will store category-specific fields
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
    type: [String],
    required: true,
    validate: {
      validator: function (value) {
        return value.length === 5;
      },
      message: "There must be exactly 5 images",
    },
  },
  mainImage: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return this.images.includes(value);
      },
      message: "Main image must be one of the product images",
    },
  },
  category: {
    type: String,
    required: true,
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
    required: true,
  },
  // Dynamic fields based on category/subcategory
  categorySpecificFields: DynamicFieldsSchema,

  // Base fields remain the same
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
});

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
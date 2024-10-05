// src/types/product.ts

// ProductCategory type to represent the categories and subcategories
export type ProductCategory = {
  name: string; // e.g., Electronics, Mobile Device, etc.
  subcategories: string[]; // e.g., Gadgets, Apple (brand), etc.
};

// Filters type for the product filters
export type ProductFilters = {
  color?: string[]; // e.g., ["Black", "White"]
  ram?: string[]; // e.g., ["8GB", "16GB"]
  rom?: string[]; // e.g., ["128GB", "256GB"]
  condition?: "New" | "Refurbished" | "Used"; // e.g., "New", "Refurbished", "Used"
  otherFeatures?: string[]; // Add any other filterable options (optional)
};

// Main Product type based on your database schema
export type Product = {
  id: string; // This will typically be a string in MongoDB
  name: string;
  description: string;
  price: number;
  countInStock: number;
  images: string[]; // Array of image URLs
  mainImage: string; // URL of the main image
  categories: ProductCategory[]; // Array of categories
  filters: ProductFilters; // Filters object
  createdAt: Date; // Date when the product was created
  discount: number; // Optional discount field
  featured?: boolean; // Optional field to indicate if the product is featured
  trending?: boolean; // Optional field to indicate if the product is trending
  top?: boolean; // Optional field for top products
  today?: boolean; // Optional field for today's products
  rating: number; // Optional rating field
};

// ProductType can also represent a more specific version of the Product type
export type ProductType = {
  id: string; // This will typically be a string in MongoDB
  name: string;
  description: string;
  price: number;
  countInStock: number;
  images: string[]; // Array of image URLs
  mainImage: string; // URL of the main image
  categories: ProductCategory[]; // Array of categories
  filters: ProductFilters; // Filters object
  createdAt: Date; // Date when the product was created
  discount: number; // Optional discount field
  featured?: boolean; // Optional field to indicate if the product is featured
  trending?: boolean; // Optional field to indicate if the product is trending
  top?: boolean; // Optional field for top products
  today?: boolean; // Optional field for today's products
  rating: number; // Optional rating field
};

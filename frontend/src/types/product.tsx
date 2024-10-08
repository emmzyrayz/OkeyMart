// Type for product-specific input options (like brands, materials, etc.)
export type CategoryDetails = {
  types?: string[]; // e.g., list of farm animals, list of children's clothing types
  brands?: string[]; // e.g., clothing brands for Babies & Kids
  materials?: string[]; // e.g., fabrics for clothing or materials for toys
  colors?: string[]; // e.g., colors available for clothing, toys, etc.
  conditions?: ("New" | "Used" | "Refurbished")[]; // e.g., product condition
  otherFeatures?: string[]; // Additional features specific to this category
};

// Subcategory type that includes additional options for forms
export type SubCategory = {
  name: string; // e.g., Farm Animal, Children's Clothing
  details?: CategoryDetails; // Optional form details for this subcategory
};

// ProductCategory type to represent categories and their subcategories
export type ProductCategory = {
  name: string; // e.g., Agriculture & Food, Babies & Kids
  subcategories: SubCategory[]; // Array of subcategories with their details
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
  category: any;
  _id: string;
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

import { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";

// Define the types for your product data
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  // Add any other fields
}

interface ProductContextType {
  products: Product[];
  fetchProducts: () => Promise<void>;
  getProduct: (id: string) => Promise<Product | null>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updatedProduct: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Create a custom hook to use the ProductContext
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

// Product Provider component
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch a single product by ID
  const getProduct = async (id: string) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  // Add a new product
  const addProduct = async (product: Product) => {
    try {
      await axios.post("/api/products", product);
      fetchProducts(); // Refresh product list after adding
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Update an existing product
  const updateProduct = async (id: string, updatedProduct: Product) => {
    try {
      await axios.put(`/api/products/${id}`, updatedProduct);
      fetchProducts(); // Refresh product list after updating
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete a product
  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts(); // Refresh product list after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <ProductContext.Provider
      value={{ products, fetchProducts, getProduct, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};
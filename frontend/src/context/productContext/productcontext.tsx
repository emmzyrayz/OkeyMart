// ProductContext.tsx

import {createContext, useState, useContext, ReactNode} from "react";
import axios from "axios";

// Define the types for your product data
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  countInStock: number;
  mainImage?: string;
  categories?: string[];
  filters?: string[];
  discount?: number;
  featured?: boolean;
  trending?: boolean;
  top?: boolean;
  today?: boolean;
  rating?: number;
}

interface ProductContextType {
  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updatedProduct: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({children}: {children: ReactNode}) => {
  const [products, setProducts] = useState<Product[]>([]);

  const apiUrl = "https://okeymart.onrender.com/api/products"; // Your Render API URL

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(apiUrl);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Add a new product
  const addProduct = async (product: Product) => {
    try {
      const response = await axios.post(apiUrl, product);
      setProducts((prev) => [...prev, response.data]); // Update state with new product
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Update an existing product
  const updateProduct = async (id: string, updatedProduct: Product) => {
    try {
      const response = await axios.put(`${apiUrl}/${id}`, updatedProduct); // Ensure your route handles this
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? response.data : product))
      ); // Update state
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete a product
  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/${id}`); // Ensure your route handles this
      setProducts((prev) => prev.filter((product) => product.id !== id)); // Update state
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// ProductContext.tsx

import {createContext, useState, useContext, ReactNode, useEffect, useCallback} from "react";
import axios from "axios";
import { Product } from "@/types/product";

// Define the types for your product data

interface ProductContextType {
  products: Product[];
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  const apiUrl = "https://okeymart.onrender.com/api/products"; // Your Render API URL

  // Fetch all products
   const fetchProducts = useCallback(async () => {

    try {
      setLoading(true);
    
      const response = await axios.get(apiUrl);
      // console.log("API response:", response.data);
      setProducts(response.data);
      // console.log("Products state after setting:", response.data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); // Set loading to false once fetching is done
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const initFetch = async () => {
      try{
        const response = await axios.get(apiUrl);
        if (isSubscribed) {
          setProducts(response.data)
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    initFetch();

    return () => {
      isSubscribed = false;
    };
  }, []);


  // Add a new product
  const addProduct = async (product: Product) => {

    try {
      const response = await axios.post(apiUrl, product);
      setProducts((prev) => [...prev, response.data]); 
      // console.log("Product added successfully:", response.data);
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
      // console.log("Product updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete a product
  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/${id}`); // Ensure your route handles this
      setProducts((prev) => prev.filter((product) => product.id !== id)); // Update state
      // console.log("Product deleted successfully:", id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
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

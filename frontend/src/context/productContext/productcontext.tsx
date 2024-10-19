import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import {
  Product,
  ProductFormData,
  mapFormDataToProduct,
} from "@/types/product";
import {getCategory, getSubcategoryConfig} from "@/config/categoryvalidation";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: ProductFormData) => Promise<void>;
  updateProduct: (id: string, updatedProduct: ProductFormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getCategoryConfig: (categoryName: string) => ReturnType<typeof getCategory>;
  getSubcategoryFields: (
    categoryName: string,
    subcategoryName: string
  ) => ReturnType<typeof getSubcategoryConfig>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = "https://okeymart.onrender.com/api/products";

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>(apiUrl);
      setProducts(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching products:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productFormData: ProductFormData) => {
    try {
      const productData = mapFormDataToProduct(productFormData);
      const response = await axios.post<Product>(apiUrl, productData);
      setProducts((prev) => [...prev, response.data]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error adding product:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const updateProduct = async (
    id: string,
    updatedProductFormData: ProductFormData
  ) => {
    try {
      const updatedProductData = mapFormDataToProduct(updatedProductFormData);
      const response = await axios.put<Product>(
        `${apiUrl}/${id}`,
        updatedProductData
      );
      setProducts((prev) =>
        prev.map((product) => (product._id === id ? response.data : product))
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const getCategoryConfig = useCallback((categoryName: string) => {
    return getCategory(categoryName);
  }, []);

  const getSubcategoryFields = useCallback(
    (categoryName: string, subcategoryName: string) => {
      return getSubcategoryConfig(categoryName, subcategoryName);
    },
    []
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getCategoryConfig,
        getSubcategoryFields,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
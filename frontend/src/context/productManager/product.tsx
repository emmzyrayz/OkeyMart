// ProductManager.tsx

import {useEffect} from "react";
import {useProductContext} from "../productContext/productcontext";

interface Product {
  id?: string; // Optional when adding a new product
  name: string;
  description: string;
  price: number;
  countInStock: number;
  images: string[];
  category?: string; // Make optional if not always required
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


const ProductManager = () => {
  const {products, fetchProducts, addProduct, updateProduct, deleteProduct} =
    useProductContext();

  useEffect(() => {
    fetchProducts(); // Fetch products on mount
  }, [fetchProducts]);

  const handleAddProduct = async () => {
    const newProduct = {
      name: "New Product",
      description: "This is a new product",
      price: 10,
      countInStock: 100,
      images: ["newProduct.jpg"],
      category: "Example Category",
      // Add other fields as necessary
    };

    await addProduct(newProduct);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
  };

  return (
    <div>
      <h1>Product Manager</h1>
      <button onClick={handleAddProduct}>Add Product</button>
      <ul>
        {products.map((product) => (
          <li key={product.id ?? "default-id"}>
            {" "}
            {/* Use fallback for key */}
            {product.name} - ${product.price}
            <button onClick={() => handleDeleteProduct(product.id ?? "")}>
              {" "}
              {/* Fallback for delete */}
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;

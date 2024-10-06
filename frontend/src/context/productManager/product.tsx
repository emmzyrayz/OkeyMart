// ProductManager.tsx

import {useEffect} from "react";
import {useProductContext} from "../productContext/productcontext";
import type { Product } from "@/types/product";



const ProductManager = () => {
  const {products, fetchProducts, addProduct, updateProduct, deleteProduct} =
    useProductContext();

  useEffect(() => {
    fetchProducts(); // Fetch products on mount
  }, [fetchProducts]);

  const handleAddProduct = async () => {
    const newProduct: Product = {
      id: '1',
      _id: "id",
      name: "New Product",
      description: "This is a new product",
      price: 10,
      countInStock: 100,
      images: ["newProduct.jpg"],
      mainImage: "updatedProduct.jpg",
      categories: [
        {
          name: "example category",
          subcategories: ["subcategory1", "subcategory2"],
        },
      ],
      filters: {},
      createdAt: new Date(),
      discount: 5,
      trending: false,
      today: false,
      top: false,
      rating: 0,
      // Add other fields as necessary
    };

    await addProduct(newProduct);
  };

  const handleUpdateProduct = async (id: string) => {
    const updatedProduct: Product = {
      id,
      _id: 'id',
      name: "Updated Product",
      description: "This is an updated product",
      price: 15,
      countInStock: 150,
      images: ["updatedProduct.jpg"],
      mainImage: "updatedProduct.jpg",
      categories: [
        {
          name: "example category",
          subcategories: ["subcategory1", "subcategory2"],
        },
      ],
      filters: {},
      createdAt: new Date(),
      discount: 5,
      trending: false,
      today: false,
      top: false,
      rating: 0,
    };

    await updateProduct(id, updatedProduct);
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
            <button onClick={() => handleUpdateProduct(product.id ?? "")}>
              Update Product
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;
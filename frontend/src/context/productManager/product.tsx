import React, {useEffect} from "react";
import {useProductContext} from "../productContext/productcontext"; // Import the custom context hook

const ProductManager = () => {
  const {products, fetchProducts, addProduct, deleteProduct} =
    useProductContext();

    // updateProduct,
      // Fetch products on component mount
      useEffect(() => {
        fetchProducts();
      }, [fetchProducts]);

  const handleAddProduct = () => {
    const newProduct = {
      id: "new_id",
      name: "New Product",
      description: "Description of new product",
      price: 100,
      images: ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg"],
      category: "Category",
    };
    addProduct(newProduct);
  };

  return (
    <div>
      <h1>Product Manager</h1>
      <button onClick={handleAddProduct}>Add Product</button>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
            {/* Add more actions like update, view details */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;

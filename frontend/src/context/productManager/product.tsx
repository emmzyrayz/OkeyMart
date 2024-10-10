import {useEffect} from "react";
import {useProductContext} from "../productContext/productcontext";
import type {Product, SubCategory, ProductCategory} from "@/types/product";

const ProductManager = () => {
  const {products, fetchProducts, addProduct, updateProduct, deleteProduct} =
    useProductContext();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async () => {
    // Create proper SubCategory objects
    const subcategories: SubCategory[] = [
      {
        name: "subcategory1",
        details: {
          types: ["type1", "type2"],
          brands: ["brand1", "brand2"],
        },
      },
      {
        name: "subcategory2",
        details: {
          types: ["type3", "type4"],
          brands: ["brand3", "brand4"],
        },
      },
    ];

    // Create proper ProductCategory object
    const categories: ProductCategory[] = [
      {
        name: "example category",
        subcategories: subcategories,
      },
    ];

    const newProduct: Product = {
      id: "1",
      _id: "id",
      name: "New Product",
      description: "This is a new product",
      price: 10,
      countInStock: 100,
      images: ["newProduct.jpg"],
      mainImage: "updatedProduct.jpg",
      categories: categories,
      filters: {},
      createdAt: new Date(),
      discount: 5,
      trending: false,
      today: false,
      top: false,
      rating: 0,
    };

    await addProduct(newProduct);
  };

  const handleUpdateProduct = async (id: string) => {
    // Create proper SubCategory objects for update
    const subcategories: SubCategory[] = [
      {
        name: "subcategory1",
        details: {
          types: ["type1", "type2"],
          brands: ["brand1", "brand2"],
        },
      },
      {
        name: "subcategory2",
        details: {
          types: ["type3", "type4"],
          brands: ["brand3", "brand4"],
        },
      },
    ];

    // Create proper ProductCategory object for update
    const categories: ProductCategory[] = [
      {
        name: "example category",
        subcategories: subcategories,
      },
    ];

    const updatedProduct: Product = {
      id,
      _id: "id",
      name: "Updated Product",
      description: "This is an updated product",
      price: 15,
      countInStock: 150,
      images: ["updatedProduct.jpg"],
      mainImage: "updatedProduct.jpg",
      categories: categories,
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
            {product.name} - ${product.price}
            <button onClick={() => handleDeleteProduct(product.id ?? "")}>
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
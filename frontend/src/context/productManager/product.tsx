import React, {useEffect, useState} from "react";
import {useProductContext} from "../productContext/productcontext";
import { ProductFormData, createEmptyProduct} from "@/types/product";
import {
  categories,
} from "@/config/categoryvalidation";

const ProductManager: React.FC = () => {
  const {
    products,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategoryConfig,
    getSubcategoryFields,
  } = useProductContext();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [formData, setFormData] = useState<ProductFormData>(
    createEmptyProduct()
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedSubcategory("");
    setFormData((prev) => ({
      ...prev,
      category,
      subcategory: "",
      categorySpecificFields: {},
    }));
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategory = e.target.value;
    setSelectedSubcategory(subcategory);
    setFormData((prev) => ({...prev, subcategory, categorySpecificFields: {}}));
  };

  const handleSpecificFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      categorySpecificFields: {
        ...prev.categorySpecificFields,
        [fieldName]: value,
      },
    }));
  };

  const handleAddProduct = async () => {
    await addProduct(formData);
    setFormData(createEmptyProduct());
  };

  const handleUpdateProduct = async (id: string) => {
    const productToUpdate = products.find((p) => p._id === id);
    if (productToUpdate) {
      await updateProduct(id, {
        ...productToUpdate,
        ...formData,
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
  };

  const categoryConfig = getCategoryConfig(selectedCategory);
  const subcategoryFields = getSubcategoryFields(
    selectedCategory,
    selectedSubcategory
  );

  return (
    <div>
      <h1>Product Manager</h1>

      <form>
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Product Name"
        />
        <input
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          name="price"
          type="number"
          value={formData.price.toString()}
          onChange={handleInputChange}
          placeholder="Price"
        />
        <input
          name="countInStock"
          type="number"
          value={formData.countInStock.toString()}
          onChange={handleInputChange}
          placeholder="Count in Stock"
        />

        <select
          name="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {selectedCategory && categoryConfig && (
          <select
            name="subcategory"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
          >
            <option value="">Select Subcategory</option>
            {categoryConfig.subcategories.map((subcat) => (
              <option key={subcat.name} value={subcat.name}>
                {subcat.name}
              </option>
            ))}
          </select>
        )}

        {subcategoryFields &&
          subcategoryFields.requiredFields.map((field) => (
            <div key={field}>
              <label>{field}</label>
              <input
                type="text"
                value={(
                  formData.categorySpecificFields[field] || ""
                ).toString()}
                onChange={(e) =>
                  handleSpecificFieldChange(field, e.target.value)
                }
              />
            </div>
          ))}

        <button type="button" onClick={handleAddProduct}>
          Add Product
        </button>
      </form>

      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - ${product.price}
            <button onClick={() => handleDeleteProduct(product._id)}>
              Delete
            </button>
            <button onClick={() => handleUpdateProduct(product._id)}>
              Update Product
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;
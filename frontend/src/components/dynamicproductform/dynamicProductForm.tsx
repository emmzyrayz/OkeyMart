// components/DynamicProductForm.tsx
import React, {useState, useEffect} from "react";
import {categories, getSubcategoryConfig} from "@/config/categoryvalidation";
import {
  ProductFormData,
  SubcategoryConfig,
  FormFieldValue,
  createEmptyProduct,
} from "@/types/product";
import {WaveInput} from "@/components/input/waveinput";
import {WaveSelect} from "@/components/input/waveselect";

const DynamicProductForm = () => {
  const [formData, setFormData] = useState<ProductFormData>(
    createEmptyProduct()
  );
  const [formFields, setFormFields] = useState<SubcategoryConfig | null>(null);

  useEffect(() => {
    if (formData.category && formData.subcategory) {
      const fields = getSubcategoryConfig(
        formData.category,
        formData.subcategory
      );
      setFormFields(fields || null);
    } else {
      setFormFields(null);
    }
  }, [formData.category, formData.subcategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: newCategory,
      subcategory: "",
      categorySpecificFields: {},
    }));
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubcategory = e.target.value;
    setFormData((prev) => ({
      ...prev,
      subcategory: newSubcategory,
      categorySpecificFields: {},
    }));
  };

  const handleBaseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecificFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      categorySpecificFields: {
        ...prev.categorySpecificFields,
        [name]: value,
      },
    }));
  };

  const getSubcategoriesForCategory = () => {
    const selectedCategory = categories.find(
      (cat) => cat.name === formData.category
    );
    return selectedCategory?.subcategories || [];
  };

  const formatFieldLabel = (field: string) => {
    return field
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderDynamicFields = () => {
    if (!formFields) return null;

    return formFields.requiredFields.map((field: string) => {
      const options = formFields.dropdownOptions[field];
      const fieldValue = formData.categorySpecificFields[field] || "";

      if (options) {
        return (
          <WaveSelect
            key={field}
            label={formatFieldLabel(field)}
            name={field}
            value={fieldValue.toString()}
            onChange={handleSpecificFieldChange}
            options={options.map((opt) => ({value: opt, label: opt}))}
            required
          />
        );
      }

      return (
        <WaveInput
          key={field}
          label={formatFieldLabel(field)}
          name={field}
          value={fieldValue.toString()}
          onChange={handleSpecificFieldChange}
          required
          type="text"
        />
      );
    });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="dynamic-form">
      <WaveInput
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleBaseInputChange}
        required
      />

      <WaveSelect
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleCategoryChange}
        options={categories.map((cat) => ({
          value: cat.name,
          label: cat.name,
        }))}
        required
      />

      {formData.category && (
        <WaveSelect
          label="Subcategory"
          name="subcategory"
          value={formData.subcategory}
          onChange={handleSubcategoryChange}
          options={getSubcategoriesForCategory().map((sub) => ({
            value: sub.name,
            label: sub.name,
          }))}
          required
        />
      )}

      {formFields && (
        <div className="dynamic-fields">{renderDynamicFields()}</div>
      )}
    </form>
  );
};

export default DynamicProductForm;

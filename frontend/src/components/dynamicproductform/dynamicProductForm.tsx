// components/DynamicProductForm.tsx
import React, {useState, useEffect} from "react";
import {categories, getSubcategoryConfig} from "@/config/categoryvalidation";
import {
  SubcategoryConfig,
} from "@/types/product";
import {WaveInput} from "@/components/input/waveinput";
import {WaveSelect} from "@/components/input/waveselect";
import {useProductUpload} from "@/context/productUpload/productUploadContext";

interface DynamicProductFormProps {
  category: string;
  subcategory: string;
  fields: {[key: string]: string | number | boolean};
  onChange: (fields: {[key: string]: string | number | boolean}) => void;
  errors: {[key: string]: string};
}

const DynamicProductForm: React.FC<DynamicProductFormProps> = ({
  category,
  subcategory,
  fields,
  onChange,
  errors,
}) => {
  const {state, dispatch} = useProductUpload(); // Access context
  const {formData} = state; // Extract formData from context
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
    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        category: newCategory,
        subcategory: "",
        categorySpecificFields: {},
      },
    });
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubcategory = e.target.value;
    dispatch({
      type: "SET_FORM_DATA",
      payload: {subcategory: newSubcategory, categorySpecificFields: {}},
    });
  };

  const handleSpecificFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        categorySpecificFields: {
          ...formData.categorySpecificFields,
          [name]: value,
        },
      },
    });
  };

  const getSubcategoriesForCategory = () => {
    const selectedCategory = categories.find(
      (cat) => cat.name === formData.category
    );
    return selectedCategory?.subcategories || [];
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({type: "SET_FORM_DATA", payload: {description: e.target.value}});
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
    <div onSubmit={(e) => e.preventDefault()} className="dynamic-form">
      <WaveInput
        label="Product Description"
        name="name"
        value={formData.description}
        onChange={handleDescriptionChange}
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
    </div>
  );
};

export default DynamicProductForm;

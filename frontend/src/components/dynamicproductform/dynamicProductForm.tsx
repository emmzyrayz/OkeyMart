// components/DynamicProductForm.tsx
import React, {useState, useEffect} from "react";
import {categories, getSubcategoryConfig} from "@/config/categoryvalidation";
import {
  SubcategoryConfig,
} from "@/types/product";
import {WaveInput} from "@/components/input/waveinput";
import {WaveSelect} from "@/components/input/waveselect";
import {useProductUpload} from "@/context/productUpload/productUploadContext";

// Extended interfaces for the Wave components


// Updated form data interface
interface FormDataType {
  category: string;
  subcategory: string;
  categorySpecificFields: { [key: string]: string | number | boolean };
  description?: string;
  state?: string;
  lga?: string;
  bulkNumber?: string;
  bulkPrice?: string;
  video?: string;
  youtubeLink?: string;
  images: string[];
  name: string;
  rating: number;
  [key: string]: any; // Allow for additional dynamic fields
}

interface DynamicProductFormProps {
  category: string;
  subcategory: string;
  fields: {[key: string]: string | number | boolean};
  onChange: (fields: FormDataType) => void;
  errors: {[key: string]: string};
}

const DynamicProductForm: React.FC<DynamicProductFormProps> = ({
  category: initialCategory,
  subcategory: initialSubcategory,
  fields: initialFields,
  onChange,
  errors,
}) => {
  const {state, dispatch} = useProductUpload(); // Access context
  const {formData} = state; // Extract formData from context
  const [formFields, setFormFields] = useState<SubcategoryConfig | null>(null);

  useEffect(() => {
    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        category: initialCategory,
        subcategory: initialSubcategory,
        categorySpecificFields: initialFields,
      },
    });
  }, [initialCategory, initialSubcategory, initialFields, dispatch]);

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
    const newState: FormDataType = {
      ...formData,
      category: newCategory,
      subcategory: "",
      categorySpecificFields: {},
    };

    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        category: newCategory,
        subcategory: "",
        categorySpecificFields: {},
      },
    });
    onChange(newState);
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubcategory = e.target.value;
    const newState: FormDataType = {
      ...formData,
      subcategory: newSubcategory,
      categorySpecificFields: {},
    };

    dispatch({
      type: "SET_FORM_DATA",
      payload: {subcategory: newSubcategory, categorySpecificFields: {}},
    });
    onChange(newState);
  };

  const handleSpecificFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    const newCategorySpecificFields = {
      ...formData.categorySpecificFields,
      [name]: value,
    };
    const newState: FormDataType = {
      ...formData,
      categorySpecificFields: newCategorySpecificFields,
    };

    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        categorySpecificFields: newCategorySpecificFields,
      },
    });
    onChange(newState);
  };

  const getSubcategoriesForCategory = () => {
    const selectedCategory = categories.find(
      (cat) => cat.name === formData.category
    );
    return selectedCategory?.subcategories || [];
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState: FormDataType = {...formData, description: e.target.value};
    dispatch({type: "SET_FORM_DATA", payload: {description: e.target.value}});
    onChange(newState);
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
      const errorMessage = errors[field];

      if (options) {
        return (
          <WaveSelect
            key={field}
            label={formatFieldLabel(field)}
            name={field}
            value={fieldValue.toString()}
            onChange={handleSpecificFieldChange}
            options={options.map((opt) => ({value: opt, label: opt}))}
            error={errorMessage}
            required
          /> as React.ReactElement
        );
      }

      return (
        <WaveInput
          key={field}
          label={formatFieldLabel(field)}
          name={field}
          value={fieldValue.toString()}
          onChange={handleSpecificFieldChange}
          error={errorMessage}
          required
          type="text"
        /> as React.ReactElement
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
        error={errors.description}
        required
      /> as React.ReactElement

      <WaveSelect
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleCategoryChange}
        options={categories.map((cat) => ({
          value: cat.name,
          label: cat.name,
        }))}
        error={errors.category}
        required
      /> as React.ReactElement

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
          error={errors.subcategory}
          required
        /> as React.ReactElement
      )}

      {formFields && (
        <div className="dynamic-fields">{renderDynamicFields()}</div>
      )}
    </div>
  );
};

export default DynamicProductForm;

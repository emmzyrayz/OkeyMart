// components/DynamicProductForm.tsx
import React, {useState, useEffect} from "react";
import {categories, getSubcategoryConfig} from "@/config/categoryvalidation";
import {FormData, SubcategoryConfig} from "@/types/categorytypes";
import {WaveInput} from "@/components/input/waveinput";
import {WaveSelect} from "@/components/input/waveselect";

const DynamicProductForm = () => {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [formFields, setFormFields] = useState<SubcategoryConfig | null>(null);
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    if (category && subcategory) {
      const fields = getSubcategoryConfig(category, subcategory);
      setFormFields(fields || null);
    } else {
      setFormFields(null);
    }
  }, [category, subcategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    setSubcategory("");
    setFormData({});
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubcategory = e.target.value;
    setSubcategory(newSubcategory);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getSubcategoriesForCategory = () => {
    const selectedCategory = categories.find((cat) => cat.name === category);
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

      if (options) {
        return (
          <WaveSelect
            key={field}
            label={formatFieldLabel(field)}
            name={field}
            value={formData[field]?.toString() || ""}
            onChange={(e) =>
              handleInputChange({
                target: {name: field, value: e.target.value},
              } as React.ChangeEvent<HTMLInputElement>)
            }
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
          value={formData[field]?.toString() || ""}
          onChange={handleInputChange}
          required
          type="text"
        />
      );
    });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="dynamic-form">
      {/* Base fields */}
      <WaveInput
        label="Product Name"
        name="name"
        value={formData.name?.toString() || ""}
        onChange={handleInputChange}
        required
      />

      {/* Category selection */}
      <WaveSelect
        label="Category"
        name="category"
        value={category}
        onChange={(e) => handleCategoryChange(e)}
        options={categories.map((cat) => ({
          value: cat.name,
          label: cat.name,
        }))}
        required
      />

      {/* Subcategory selection */}
      {category && (
        <WaveSelect
          label="Subcategory"
          name="subcategory"
          value={subcategory}
          onChange={(e) => handleSubcategoryChange(e)}
          options={getSubcategoriesForCategory().map((sub) => ({
            value: sub.name,
            label: sub.name,
          }))}
          required
        />
      )}

      {/* Dynamic fields based on subcategory */}
      {formFields && (
        <div className="dynamic-fields">{renderDynamicFields()}</div>
      )}

      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};

export default DynamicProductForm;

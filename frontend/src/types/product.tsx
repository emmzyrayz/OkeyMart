// types/productTypes.ts
export interface CategorySpecificFields {
  fieldValues: Map<string, any>;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  countInStock: number;
  images: string[];
  mainImage: string;
  category: string;
  subcategory: string;
  categorySpecificFields: CategorySpecificFields;
  createdAt: Date;
  discount: number;
  featured?: boolean;
  trending?: boolean;
  top?: boolean;
  today?: boolean;
  rating: number;
}

// Category configuration types
export interface SubcategoryConfig {
  name: string;
  requiredFields: string[];
  dropdownOptions: {
    [key: string]: string[];
  };
}

export interface CategoryConfig {
  name: string;
  subcategories: SubcategoryConfig[];
}

// Form handling types
export interface ProductFormData
  extends Omit<Product, "_id" | "createdAt" | "categorySpecificFields"> {
  categorySpecificFields: {
    [key: string]: string | number | boolean;
  };
}

// Helper type for form field values
export type FormFieldValue = string | number | boolean | string[];

// Validation types
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule;
}

// Helper functions
export const createEmptyProduct = (): ProductFormData => ({
  name: "",
  description: "",
  price: 0,
  countInStock: 0,
  images: [],
  mainImage: "",
  category: "",
  subcategory: "",
  categorySpecificFields: {},
  discount: 0,
  rating: 0,
});

export const mapFormDataToProduct = (
  formData: ProductFormData
): Omit<Product, "_id" | "createdAt"> => ({
  ...formData,
  categorySpecificFields: {
    fieldValues: new Map(Object.entries(formData.categorySpecificFields)),
  },
});

export const mapProductToFormData = (product: Product): ProductFormData => ({
  ...product,
  categorySpecificFields: Object.fromEntries(
    product.categorySpecificFields.fieldValues
  ),
});

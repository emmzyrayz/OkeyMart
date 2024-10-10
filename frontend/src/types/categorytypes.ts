// types/categoryConfig.ts
export type BaseProductFields = {
  name: string;
  description: string;
  price: number;
  countInStock: number;
  images: string[];
  mainImage: string;
  condition: "New" | "Used" | "Refurbished";
};

export type SubcategoryConfig = {
  name: string;
  requiredFields: string[];
  dropdownOptions: {
    [key: string]: string[];
  };
};

export type CategoryConfig = {
  name: string;
  subcategories: SubcategoryConfig[];
};

export type FormData = {
  [key: string]: string | number | string[] | Date;
};

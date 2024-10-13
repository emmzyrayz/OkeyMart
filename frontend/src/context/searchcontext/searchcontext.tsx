import React, {createContext, useContext, useState} from "react";
import {Product} from "@/types/product";

interface SearchContextType {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  filteredProducts: Product[];
  setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  return (
    <SearchContext.Provider
      value={{
        searchValue,
        setSearchValue,
        filteredProducts,
        setFilteredProducts,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

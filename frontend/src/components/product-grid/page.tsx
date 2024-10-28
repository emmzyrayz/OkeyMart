'use client'
import {useState} from "react";
import {WaveSelect} from "@/components/input/waveselect";
import {WaveInput} from "@/components/input/waveinput";
import {categories} from "@/config/categoryvalidation";
import Link from "next/link";
import {ProductCard} from "../product-card/page";
import "./prod-grid.css";
import {Product} from "@/types/product";


type ProductGridProps = {
  products: Product[];
  filterTag: string;
};

const getProductId = (product: Product) => {
  return product._id || product.id || null;
};

export const ProductGrid = ({products, filterTag}: ProductGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortOption, setSortOption] = useState("");


  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  const subcategoryOptions = selectedCategory
    ? categories
        .find((category) => category.name === selectedCategory)
        ?.subcategories.map((subcategory) => ({
          value: subcategory.name,
          label: subcategory.name,
        })) || []
    : [];

    const sortOptions = [
      {value: "price-asc", label: "Price: Low to High"},
      {value: "price-desc", label: "Price: High to Low"},
      {value: "name-asc", label: "Name: A-Z"},
      {value: "name-desc", label: "Name: Z-A"},
      {value: "reviews", label: "By Reviews"},
    ];


    const filteredProducts = products.filter((product) => {
      const categoryMatch = selectedCategory
        ? product.category === selectedCategory
        : true;
      const subcategoryMatch = selectedSubcategory
        ? product.subcategory === selectedSubcategory
        : true;
      const priceMatch =
        minPrice === 0 && maxPrice === 0
          ? true
          : product.price >= minPrice && product.price <= maxPrice;
      return categoryMatch && subcategoryMatch && priceMatch;
    });

    const sortedProducts = filteredProducts.sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "reviews":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  // Add debug logging
  // console.log("ProductGrid rendered with:", {
  //   productsCount: products.length,
  //   filterTag,
  //   firstProduct: products[0],
  // });

  return (
    <div className="productgrid_section flex flex-col items-start justify-center w-full h-full gap-4">
      <div className="productgrid_nav flex flex-row gap-1 items-center justify-center">
        <Link href="/">
          <span className="faint">Home</span>
        </Link>
        <span className="faint">/</span>
        <span className="full">{products[0].category}</span>
      </div>

      <div className="productgrid_top flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-4 p-4 bg-gray-100 rounded-md shadow-sm gap-2">
        {/* Grid Filter */}
        <div className="grid_filter flex flex-col w-full sm:w-1/3 gap-2">
          <WaveSelect
            label="Category"
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categoryOptions}
          />
          {selectedCategory && (
            <WaveSelect
              label="Subcategory"
              name="subcategory"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              options={subcategoryOptions}
            />
          )}
        </div>

        {/* Grid Sort */}
        <div className="grid_sort w-full sm:w-1/3">
          <WaveSelect
            label="Sort by"
            name="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            options={sortOptions}
          />
        </div>

        {/* Grid Prices */}
        <div className="grid_prices w-full sm:w-1/3 flex flex-col sm:flex-row items-center sm:space-x-2">
          <div className="w-full sm:w-1/2">
            <WaveInput
              label="Min Price"
              name="minPrice"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
          </div>
          <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
            <WaveInput
              label="Max Price"
              name="maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="productgrid_container flex flex-row flex-wrap items-start justify-center gap-2">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => {
            const productId = getProductId(product);
            if (!productId) return null;

            return (
              <ProductCard
                key={productId}
                product={product}
                filterTag={filterTag}
              />
            );
          })
        ) : (
          <p>No products available</p>
        )}
        {/* You can map through products and render ProductCard for each */}
      </div>
    </div>
  );
};

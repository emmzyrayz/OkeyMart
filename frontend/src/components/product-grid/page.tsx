import {ProductCard} from "../product-card/page";
// import { Product } from '@/types/product';
import "./prod-grid.css";

import {Product} from "@/types/product";

type ProductGridProps = {
  products: Product[];
  filterTag: string;
};

export const ProductGrid = ({products, filterTag}: ProductGridProps) => {
  // Add debug logging
  console.log("ProductGrid rendered with:", {
    productsCount: products.length,
    filterTag,
    firstProduct: products[0],
  });

  return (
    <div className="productgrid_section flex flex-col items-start justify-center w-full h-full gap-4">
      <div className="productgrid_nav flex flex-row gap-1 items-center justify-center">
        <span className="faint">Home</span>
        <span className="faint">/</span>
        <span className="full">My Account</span>
      </div>

      <div className="productgrid_top flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-4 p-4 bg-gray-100 rounded-md shadow-sm gap-2">
        {/* Grid Filter */}
        <div className="grid_filter w-full sm:w-1/3">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Filter by Category
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black">
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="gadgets">Gadget Accessories</option>
            <option value="kitchen">Kitchen Materials</option>
          </select>
        </div>

        {/* Grid Sort */}
        <div className="grid_sort w-full sm:w-1/3">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Sort by
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black">
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
            <option value="reviews">By Reviews</option>
          </select>
        </div>

        {/* Grid Prices */}
        <div className="grid_prices w-full sm:w-1/3 flex flex-col sm:flex-row items-center sm:space-x-2">
          <div className="w-full sm:w-1/2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Min Price
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Min"
            />
          </div>
          <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Max Price
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      <div className="productgrid_container flex flex-row flex-wrap items-start justify-center gap-2">
        {products.length > 0 ? (
          products.map((product) => {
            // Add debug logging for each product
            // console.log("Rendering product:", {
            //   productId: product._id,
            //   productName: product.name,
            // });

            return (
              <ProductCard
                key={product._id}
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

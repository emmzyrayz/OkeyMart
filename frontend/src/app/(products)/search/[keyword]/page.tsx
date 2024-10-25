// app/search/[keyword]/page.tsx

'use client'
import React, { useMemo } from "react";
// import Link from "next/link";
import {useProductContext} from "@/context/productContext/productcontext";
import FetchLoader from "@/components/fetchloading/page";
// import { Product } from "@/types/product";
import { ProductGrid } from "@/components/product-grid/page";


const SearchResultsPage = ({params}: {params: {keyword: string}}) => {
  const decodedKeyword = decodeURIComponent(params.keyword);
  const {products, loading} = useProductContext();

 const filteredProducts = useMemo(() => {
   const searchTerm = decodedKeyword.toLowerCase();

   return products.filter((product) => {
     const nameMatch = product.name.toLowerCase().includes(searchTerm);
     const categoryMatch = product.category.toLowerCase().includes(searchTerm);
     const subcategoryMatch = (product.subcategory || "")
       .toLowerCase()
       .includes(searchTerm);

     return nameMatch || categoryMatch || subcategoryMatch;
   });
 }, [products, decodedKeyword]);

  if (loading) {
    return <FetchLoader />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for &quot;{decodedKeyword}&quot;
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        // Render ProductGrid with filtered products
        <ProductGrid products={filteredProducts} filterTag={decodedKeyword} />
      )}
    </div>
  );
};

export default SearchResultsPage;
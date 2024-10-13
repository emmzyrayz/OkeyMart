// app/search/[keyword]/page.tsx

'use client'
import React from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {useProductContext} from "@/context/productContext/productcontext";

const SearchResultsPage = ({params}: {params: {keyword: string}}) => {
  const {keyword} = params;
  const {products, loading} = useProductContext();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase()) ||
      product.category.toLowerCase().includes(keyword.toLowerCase()) ||
      product.subcategory.toLowerCase().includes(keyword.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Search Results for "{keyword}"</h1>
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {filteredProducts.map((product) => (
            <li key={product._id}>
              <Link href={`/search/${keyword}/${product._id}`}>
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResultsPage;
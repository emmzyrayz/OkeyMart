// app/[filterTag]/[productId]/page.tsx
'use client'
import React from "react";
import {useRouter} from "next/router";
import {useProductContext} from "@/context/productContext/productcontext";

const ProductDetailsPage = ({
  params,
}: {
  params: {filterTag: string; productId: string};
}) => {
  const {filterTag, productId} = params;
  const {products, loading} = useProductContext();

  const product = products.find((p) => p._id === productId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Category: {product.category}</p>
      <p>Subcategory: {product.subcategory}</p>
      <p>Price: ${product.price}</p>
      <p>Description: {product.description}</p>
      {/* Add more product details as needed */}
    </div>
  );
};

export default ProductDetailsPage;

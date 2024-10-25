// app/[filterTag]/[productId]/page.tsx
'use client'
import React from "react";
import {useProductContext} from "@/context/productContext/productcontext";
import { ProductInfo } from "@/components/product-info/page";
import FetchLoader from "@/components/fetchloading/page";
import { ProductNotFound } from "@/components/product-notfound/page";
import RelatedProductsList from "@/components/related-product/page";
import './searchid.css';

const ProductDetailsPage = ({
  params,
}: {
  params: {productId: string};
}) => {
  const {productId} = params;
  const {products, loading} = useProductContext();

  const product = products.find((p) => p._id === productId);

  if (loading) {
    return <FetchLoader />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div>
      {/* Use the ProductInfo component to display product details */}
      <ProductInfo product={product} />

      <div className="related_product flex flex-col mt-4 w-full h-full px-[5%] pb-[30px] mb-[20px] border-box">
        <div className="related_top flex flex-row items-center gap-2">
          <div className="today_red"></div>
          <h2>Related Item</h2>
        </div>
        <RelatedProductsList />
      </div>
    </div>
  );
};

export default ProductDetailsPage;

"use client";

import {ProductInfo} from "@/components/product-info/page";
import "./prod-info.css";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import FetchLoader from "@/components/fetchloading/page";
import type {ProductType} from "@/types/product";
import RelatedProductsList from "@/components/related-product/page";

export default function Products() {
  const params = useParams();
  const [productData, setProductData] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterTag = Array.isArray(params.filterTag)
    ? params.filterTag[0]
    : params.filterTag;
  const productId = Array.isArray(params.productId)
    ? params.productId[0]
    : params.productId;


  
    useEffect(() => {
      const fetchProductData = async () => {
        try {
          const response = await fetch(
            `/api/products/${filterTag}/${productId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch product data");
          }

          const data = await response.json();
          setProductData(data);
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "An error occurred"
          );
          console.error("Failed to fetch product data:", error);
        } finally {
          setLoading(false);
        }
      };

      if (filterTag && productId) {
        fetchProductData();
      }
    }, [filterTag, productId]);

  
  if (loading) {
    return <FetchLoader />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="not-found-container">
        <h2>Product Not Found</h2>
        <p>The requested product could not be found.</p>
      </div>
    );
  }

  return (
    <div>
      <ProductInfo product={productData} />

      <div className="related_product flex flex-col mt-4 w-full h-full">
        <div className="related_top flex flex-row items-center gap-2">
          <div className="today_red"></div>
          <h2>Related Item</h2>
        </div>
        <RelatedProductsList
          currentCategory={filterTag}
        />
      </div>
    </div>
  );
}

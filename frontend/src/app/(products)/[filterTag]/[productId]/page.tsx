"use client";

import {ProductInfo} from "@/components/product-info/page";
import "./prod-info.css";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import FetchLoader from "@/components/fetchloading/page";
import type {ProductType} from "@/types/product";

export default function Products() {
    const params = useParams();
  const [productData, setProductData] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
    useEffect(() => {
      const fetchProduct = async () => {
        if (!params.filterTag || !params.productId) {
          setError("Invalid route parameters");
          setLoading(false);
          return;
        }

        try {
          const filterTag = Array.isArray(params.filterTag)
            ? params.filterTag[0]
            : params.filterTag;

          const productId = Array.isArray(params.productId)
            ? params.productId[0]
            : params.productId;

          const response = await fetch(
            `/api/products/${filterTag}/${productId}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.statusText}`);
          }

          const data = await response.json();

          if (!data) {
            throw new Error("Product not found");
          }

          setProductData(data);
          setError(null);
        } catch (err) {
          console.error("Failed to fetch product data:", err);
          setError(
            err instanceof Error ? err.message : "Failed to fetch product"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }, [params.filterTag, params.productId]);

  
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
    </div>
  );
}

'use client'

import {ProductInfo} from "@/components/product-info/page";
import "./prod-info.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FetchLoader from "@/components/fetchloading/page";

export default function Products() {
    const router = useRouter();
    const { filterTag, productId } = useParams();
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (filterTag && productId) {

            fetchProductData(String(filterTag), String(productId));
        }
    }, [filterTag, productId]);

    const fetchProductData = async (filterTag: string, productId: string) => {
        try{
            const res = await fetch(`/api/products/${filterTag}/${productId}`);
            const data = await res.json();
            setProductData(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch product data', error);
            setLoading(false);
        }
    };

    if (loading) {
        return(
            <FetchLoader />
        )
    }

    if (!productData) {
        return(
            <div>Product not found</div>
        )
    }


  return (
    <div>
      <ProductInfo product={productData} />
    </div>
  );
}

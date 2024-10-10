"use client";
import "./prroduct.css";
import {useEffect, useState} from "react";
import {ProductGrid} from "@/components/product-grid/page";
import type {Product} from "@/types/product";
import FetchLoader from "@/components/fetchloading/page";

// type FilterTag = "today" | "trending" | "top" | "featured";

export default function Product({params}: {params: {filterTag: string}}) {
  console.log("Current filter tag:", params.filterTag);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 

 useEffect(() => {
   const fetchFilteredProducts = async () => {
    setLoading(true);
     try {
       const response = await fetch(`/api/products`);
       if (!response.ok) {
         throw new Error("Failed to fetch products");
       }

       const data: Product[] = await response.json();

       // Filter products based on the tag in the URL
       // Filter products based on the tag in the URL
       let filteredProducts = data; // Default to all products

       if (params.filterTag) {
         filteredProducts = data.filter((product: Product) => {
           switch (params.filterTag) {
             case "today":
               return product.today === true;
             case "trending":
               return product.trending === true;
             case "top":
               return product.top === true;
             case "featured":
               return product.featured === true;
             default:
               return true; // No filtering, return all products
           }
         });
       }

       setProducts(filteredProducts);
     } catch (error) {
       console.error("Error fetching filtered products:", error);
       setError(error instanceof Error ? error.message : "Unknown error");
     } finally {
       setLoading(false); // Set loading to false after fetch
     }
   };

   fetchFilteredProducts();
 }, [params.filterTag]);


 if (loading) return <FetchLoader />;

 if (error) return <div>{error}</div>;

  return (
    <div className="products_section">
      <ProductGrid products={products} filterTag={params.filterTag} />{" "}
      {/* Pass products as props to ProductGrid */}
    </div>
  );
}
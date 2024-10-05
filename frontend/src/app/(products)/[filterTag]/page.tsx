"use client";
import "./prroduct.css";
import {useEffect, useState} from "react";
import {ProductGrid} from "@/components/product-grid/page";

type ProductType = {
  id: number;
  name: string;
  mainImage: string;
  images: [string];
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  today: boolean;
  // Other fields...
};

export default function Product({params}: {params: {filterTag: string}}) {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const response = await fetch(`/api/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        if (params.filterTag === "today") {
          // Filter products with 'today' set to true
          const filteredProducts = data.filter(
            (product: ProductType) => product.today === true
          );
          setProducts(filteredProducts);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    };

    fetchFilteredProducts();
  }, [params.filterTag]);

  return (
    <div className="products_section">
      <ProductGrid products={products} />{" "}
      {/* Pass products as props to ProductGrid */}
    </div>
  );
}
'use client'
import React, {useState, useEffect} from "react";
import './random.css';
import Image from 'next/image';
import FetchLoader from "../fetchloading/page";
import {useProductContext} from "@/context/productContext/productcontext";

import {Product} from "@/types/product";
import {ProductNotFound} from "../product-notfound/page";



export default function Random() {
  const {loading: globalLoading} = useProductContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null
  );
  const [localLoading, setLocalLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const {hours, minutes, seconds} = prevTime;

        // Update seconds
        if (seconds > 0) {
          return {...prevTime, seconds: seconds - 1};
        }
        // When seconds reach 0, reduce the minute and reset seconds
        else if (minutes > 0) {
          return {hours, minutes: minutes - 1, seconds: 59};
        }
        // When minutes reach 0, reduce the hour and reset minutes and seconds
        else if (hours > 0) {
          return {hours: hours - 1, minutes: 59, seconds: 59};
        }
        // Stop the countdown when time is over
        else {
          clearInterval(interval);
          return {hours: 0, minutes: 0, seconds: 0};
        }
      });
    }, 1000);

    // Clean up the interval when component unmounts
    return () => clearInterval(interval);

    
  }, []);

  useEffect(() => {
    console.log(products); // Using 'products' to avoid ESLint warning
  }, [products]);

  const isLoading = globalLoading || localLoading;

  const fetchProducts = async () => {
    try {
      setLocalLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();

      // Filter products with top set to true
      const topProducts = data.filter(
        (product: Product) => product.top === true
      );

      // Set filtered top products
      setProducts(topProducts);

      // Randomly select one product
      if (topProducts.length > 0) {
        const randomProduct =
          topProducts[Math.floor(Math.random() * topProducts.length)];
        setSelectedProduct(randomProduct);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  // Call fetchProducts when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  if (isLoading) {
    return <FetchLoader />; // Display loading component while fetching
  }

  if (products.length === 0) {
    return <ProductNotFound />;
  }

  return (
    <div className="random_section flex flex-row items-center justify-around relative">
      <div className="random_text flex flex-col items-start justify-center gap-4 w-2/4">
        {selectedProduct ? (
          <>
            <h2>{selectedProduct.categories.length > 0 ? selectedProduct.categories[0].name : 'No Category'}</h2>
            <span className="title">{selectedProduct.description}</span>
            <div className="random_time flex flex-row gap-3">
              <div className="random_hr">
                <span className="digit">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="time">Hours</span>
              </div>
              <div className="random_minutes">
                <span className="digit">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="time">Minutes</span>
              </div>
              <div className="random_seconds">
                <span className="digit">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="time">Seconds</span>
              </div>
            </div>
            <div className="random_btn flex items-center justify-center">
              <span>Buy Now</span>
            </div>
          </>
        ) : (
          <p>Loading product of the day...</p>
        )}
      </div>
      <div className="random_image flex items-center justify-center relative w-2/4 rounded-sm">
        {selectedProduct ? (
          <>
            {/* Assign product.imageUrl to the Image component */}
            <Image
              src={selectedProduct.mainImage}
              width={500}
              height={300}
              alt={selectedProduct.name}
              className="rounded-sm"
            />
          </>
        ) : (
          <p>Loading product of the day...</p>
        )}
      </div>
    </div>
  );
}
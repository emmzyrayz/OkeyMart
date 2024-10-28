'use client'
import React, {useState, useEffect} from "react";
import './random.css';
import Image from 'next/image';
import FetchLoader from "../fetchloading/page";
import {useProductContext} from "@/context/productContext/productcontext";
import {useRouter} from "next/navigation";
import {Product} from "@/types/product";
import {ProductNotFound} from "../product-notfound/page";

const getProductId = (product: Product): string | null => {
  return product._id || product.id || null;
};


export default function Random() {
  const router = useRouter();
  const {products, loading} = useProductContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null
  );

  


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
    if (products.length > 0) {
      const topProducts = products.filter((product) => product.top === true);
      if (topProducts.length > 0) {
        const randomProduct =
          topProducts[Math.floor(Math.random() * topProducts.length)];
        setSelectedProduct(randomProduct);
      }
    }
  }, [products]);



  // Call fetchProducts when component mounts

  if (loading) {
    return <FetchLoader />; // Display loading component while fetching
  }

  if (products.length === 0) {
    return <ProductNotFound />;
  }

  return (
    <div className="random_section relative">
      <div className="random_text ">
        {selectedProduct ? (
          <>
            <h2>{selectedProduct.category}</h2>
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
            <div
              className="random_btn "
              onClick={() => {
                const productId = getProductId(selectedProduct);
                if (productId) {
                  router.push(`/top/${productId}`);
                }
              }}
            >
              <span>Buy Now</span>
            </div>
          </>
        ) : (
          <p>Loading product of the day...</p>
        )}
      </div>
      <div className="random_image ">
        {selectedProduct ? (
          <>
            {/* Assign product.imageUrl to the Image component */}
            <Image
              src={selectedProduct.mainImage}
              width={500}
              height={300}
              alt={selectedProduct.name}
              className="rounded-md"
            />
          </>
        ) : (
          <p>Loading product of the day...</p>
        )}
      </div>
    </div>
  );
}
'use client'
import React, {useState, useEffect, useRef, useMemo} from "react";
import "./today.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FetchLoader from "../fetchloading/page";
import {
  useProductContext,
} from "@/context/productContext/productcontext";

import { ProductType } from "@/types/product";
import { ProductNotFound } from "../product-notfound/page";
import {
  FaArrowLeft,
  FaArrowRight,
  FaStar,
  FaRegStar,
  FaRegHeart,
  FaHeart,
  FaRegEye,
  FaEye,
  FaStarHalf,
} from "react-icons/fa6";


const renderStars = (rating: number) => {
  // Round the rating to the nearest number
  const roundedRating = Math.round(rating);

  // Calculate full stars, half stars, and empty stars
  const fullStars = Math.floor(roundedRating / 1); // Number of full stars
  const halfStars = roundedRating % 1 >= 0.5 ? 1 : 0; // One half star if there's a half rating
  const emptyStars = 5 - fullStars - halfStars; // Remaining stars are empty

  const stars = [];

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="fa-star" />);
  }

  // Add half stars
  if (halfStars) {
    stars.push(
      <div key="half" className="half-star-container">
        <FaStarHalf className="fa-star" />
        <FaRegStar className="half-fill" />
      </div>
    );
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="fa-star" />);
  }

  return stars;
};

const ProductRating = ({product}: {product: ProductType}) => {
  return (
    <div className="rating_icon flex flex-row items-center">
      {renderStars(product.rating)} {/* Call the renderStars function */}
    </div>
  );
};

export default function Today() {
  const router = useRouter();
  const { products, loading } = useProductContext();
  const [heartedItems, setHeartedItems] = useState<boolean[]>([]);
  const [eyedItems, setEyedItems] = useState<boolean[]>([]);
   const scrollContainerRef = useRef<HTMLDivElement>(null);

   const filteredProducts = useMemo(() => {
    return products
      .filter(product => product.today === true)
      .slice(0, 12);
   }, []);

  // Set the end date here (e.g., Dec 31, 2024)
  const endDate = useMemo(() => new Date("2024-12-31T23:59:59").getTime(), []);
 

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setHeartedItems(new Array(filteredProducts.length).fill(false));
    setEyedItems(new Array(filteredProducts.length).fill(false));
  }, [filteredProducts.length]);


  useEffect(() => {
    

    // Update countdown every second
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate - now;

      // Time calculations
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Check if the countdown is over
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      } else {
        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
        });
      }
    }, 1000);

    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, [endDate]);

  if (loading) {
    return <FetchLoader />; // Display loading component while fetching
  }

  if (products.length === 0) {
    return <ProductNotFound />;
  }


  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({left: -200, behavior: "smooth"});
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({left: 200, behavior: "smooth"});
    }
  };

  const handleHeartClick = (index: number) => {
    setHeartedItems((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleEyeClick = (index: number) => {
    setEyedItems((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div className="today_section w-full flex flex-col">
      <div className="today_top flex flex-row items-center gap-2">
        <div className="today_red"></div>
        <h2>Today&apos;s</h2>
      </div>
      <div className="today_header flex flex-row w-full">
        <div className="left flex flex-row">
          <span className="title">Flash Sales</span>
          <div className="sale-count flex flex-row items-center">
            <div className="day-count">
              <span className="title">Days</span>
              <span className="count">
                {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}
              </span>
            </div>
            <span className="stylable-semicolon">:</span>
            <div className="hour-count">
              <span className="title">Hours</span>
              <span className="count">
                {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
              </span>
            </div>
            <span className="stylable-semicolon">:</span>
            <div className="minute-count">
              <span className="title">Minutes</span>
              <span className="count">
                {timeLeft.minutes < 10
                  ? `0${timeLeft.minutes}`
                  : timeLeft.minutes}
              </span>
            </div>
            <span className="stylable-semicolon">:</span>
            <div className="seconds-count">
              <span className="title">Seconds</span>
              <span className="count">
                {timeLeft.seconds < 10
                  ? `0${timeLeft.seconds}`
                  : timeLeft.seconds}
              </span>
            </div>
          </div>
        </div>
        <div className="right flex flex-row">
          <div
            className="icons items-center justify-center"
            onClick={scrollLeft}
          >
            <FaArrowLeft className="icon" />
          </div>
          <div
            className="icons items-center justify-center"
            onClick={scrollRight}
          >
            <FaArrowRight className="icon" />
          </div>
        </div>
      </div>
      <div
        className="today_product flex flex-row overflow-x-auto mb-8"
        ref={scrollContainerRef}
      >
        {filteredProducts.map((product, index) => {
          const discountPrice = product.price * (1 - (product.discount) / 100);
          
          return(
            <div className="product_item" key={index}>
            <div className="product_image">
              <span className="discount">{product.discount}%</span>
              <Image
                alt={`product ${index + 1}`}
                width={200}
                height={300}
                src={product.mainImage}
              />
              <div className="product_icons">
                <div
                  className="icon-heart"
                  onClick={() => handleHeartClick(index)}
                >
                  {heartedItems[index] ? (
                    <FaHeart className="fas" />
                  ) : (
                    <FaRegHeart className="fa" />
                  )}
                </div>
                <div className="icon-eye" onClick={() => handleEyeClick(index)}>
                  {eyedItems[index] ? (
                    <FaEye className="fas" />
                  ) : (
                    <FaRegEye className="fa" />
                  )}
                </div>
              </div>
              <div className="product_btn">
                <span>Add To Cart</span>
              </div>
            </div>
            <div className="product_detail">
              <div className="product_name">{product.name}</div>
              <div className="product_price">
                <div className="dscount_price">${discountPrice.toFixed(2)}</div>
                <div className="actual_price">${product.price}</div>
              </div>
              <div className="rating">
                <div className="rating_icon flex flex-row items-center">
                  <ProductRating product={product} /> {/* Render the rating */}
                </div>
                <div className="rating_number">
                  ({product.rating.toFixed(1)})
                </div>
              </div>
            </div>
          </div>
          );
                  })}
      </div>
      <div className="today_btn flex items-center justify-center">
        <span onClick={() => router.push('/product/today')}>View All Products</span>
      </div>
      <hr />
    </div>
  );
}

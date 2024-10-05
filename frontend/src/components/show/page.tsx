"use client";
import React, {useRef, useState, useEffect} from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  // FaCheck,
  FaEye,
  FaHeart,
  FaRegEye,
  FaRegHeart,
  FaRegStar,
  FaStar,
  FaStarHalf,
} from "react-icons/fa6";
import Image from "next/image";
import "./show.css";
import FetchLoader from "../fetchloading/page";
import { useProductContext, Product } from "@/context/productContext/productcontext";
import { ProductNotFound } from "../product-notfound/page";




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

const ProductRating = ({product}: {product: Product}) => {
  // Provide a fallback value for product.rating
  const rating = product.rating ?? 0;

  return (
    <div className="rating_icon flex flex-row items-center">
      {renderStars(rating)} {/* Call the renderStars function */}
    </div>
  );
};



export default function Show() {
  const {products, fetchProducts, loading: globalLoading} = useProductContext();
  const [heartedItems, setHeartedItems] = useState<boolean[]>([]);
  const [eyedItems, setEyedItems] = useState<boolean[]>([]);

  // Handle click on heart or eye icons
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [viewedItems, setViewedItems] = useState<number[]>([]);

  const [activeColors, setActiveColors] = useState<string[]>(
    Array(products.length).fill("red")
  );

  const colors = ["red", "orange", "yellow", "black"];

  // Create two separate refs for each grid
  const topGridRef = useRef<HTMLDivElement>(null);
  const bottomGridRef = useRef<HTMLDivElement>(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts(); 
    console.log("Products fetched: ", products);
  }, [fetchProducts]);

  if (globalLoading) {
    return <FetchLoader />; // Display loading component while fetching
  }

  if (products.length === 0 ) {
    return <ProductNotFound />;
  }

  console.log("Products in component:", products);

  const topFilProducts = products.filter((product) => product.top === true);
  console.log("Top Products: ", topFilProducts);

  // Filter products with 'top' set to true and limit to 16 products
  const topDisProducts = topFilProducts.slice(0, 16);
  console.log("Displayed Products: ", topDisProducts);

  products.forEach((product, index) => {
    console.log(`Product ${index}: `, product); // Log individual products
    console.log("Product ID: ", product.id); // Ensure product has an ID
    console.log("Product Name: ", product.name); // Ensure product has a name
    console.log("Product Top: ", product.top); // Ensure product has 'top' property
  });

  const toggleLike = (productId: number) => {
    if (likedItems.includes(productId)) {
      setLikedItems(likedItems.filter((id) => id !== productId));
    } else {
      setLikedItems([...likedItems, productId]);
    }
  };

  const toggleView = (productId: number) => {
    if (viewedItems.includes(productId)) {
      setViewedItems(viewedItems.filter((id) => id !== productId));
    } else {
      setViewedItems([...viewedItems, productId]);
      // You can handle modal view or any other logic here for viewing
    }
  };

  const handleColorChange = (index: number, color: string) => {
    const updatedColors = [...activeColors];
    updatedColors[index] = color; // Set the selected color for the product
    setActiveColors(updatedColors); // Update the state
  };

  // Scroll functions for both grids
  const scrollLeft = () => {
    topGridRef.current?.scrollBy({left: -200, behavior: "smooth"});
    bottomGridRef.current?.scrollBy({left: -200, behavior: "smooth"});
  };

  const scrollRight = () => {
    topGridRef.current?.scrollBy({left: 200, behavior: "smooth"});
    bottomGridRef.current?.scrollBy({left: 200, behavior: "smooth"});
  };

  const handleHeartClick = (index: number) => {
    const updatedHeartedItems = [...heartedItems];
    updatedHeartedItems[index] = !updatedHeartedItems[index];
    setHeartedItems(updatedHeartedItems);
    const productId = Number(products[index].id || ""); // Ensure it’s a string
    toggleLike(productId); // Call your toggleLike with the product id
  };

  const handleEyeClick = (index: number) => {
    const updatedEyedItems = [...eyedItems];
    updatedEyedItems[index] = !updatedEyedItems[index];
    setEyedItems(updatedEyedItems);
    const productId = Number(products[index].id || ""); // Ensure it’s a string
    toggleView(productId); // Call your toggleView with the product id
  };


  // Split products into two halves
  const middleIndex = Math.ceil(topDisProducts.length / 2);
  const topProducts = topDisProducts.slice(0, middleIndex);
  const bottomProducts = topDisProducts.slice(middleIndex);

  return (
    <div className="show_section w-full flex flex-col">
      <div className="category_top flex flex-row items-center gap-2">
        <div className="category_red"></div>
        <h2>Our Products</h2>
      </div>
      <div className="category_header flex flex-row w-full">
        <div className="header-title">
          <span>Explore Our Products</span>
        </div>
        <div className="header_btn flex flex-row">
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

      <div className="show_grid flex flex-col gap-2 mb-8">
        <div
          className="top_grid flex flex-row overflow-x-auto"
          ref={topGridRef}
        >
          {topProducts.map((product, index) => {
            console.log("Rendering product: ", product);

            return (
              <div className="top_item" key={product.id}>
                <div className="product_image">
                  <Image
                    alt={product.name}
                    width={200}
                    height={300}
                    src={product.mainImage || "/default-image.jpg"} // Ensure a default image
                  />
                  <div key={product.id} className="product_icons">
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
                    <div
                      className="icon-eye"
                      onClick={() => handleEyeClick(index)}
                    >
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
                <div className="product_detal flex flex-col">
                  <h3>{product.name}</h3>
                  <div className="info flex flex-row gap-1 items-center">
                    <span className="price">{product.price}</span>
                    <div className="rating">
                      <div className="rating_icon flex flex-row items-center">
                        <ProductRating product={product} />{" "}
                        {/* Render the rating */}
                      </div>
                    </div>
                    <span className="reviews">
                      ({product.rating?.toFixed(1) ?? "N/A"})
                    </span>
                  </div>
                  <div className="color-var flex flex-row gap-2 items-center relative">
                    {colors.map((color) => (
                      <div
                        key={color}
                        className={`color-item ${color} ${
                          activeColors[index] === color ? "active" : ""
                        }`}
                        onClick={() => handleColorChange(index, color)}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="bottom_grid flex flex-row overflow-x-auto"
          ref={bottomGridRef}
        >
          {bottomProducts.map((product, index) => {
            console.log("Rendering product: ", product);

            return (
              <div className="top_item" key={product.id}>
                <div className="product_image">
                  <Image
                    alt={product.name}
                    width={200}
                    height={300}
                    src={product.mainImage || "/default-image.jpg"} // Ensure a default image
                  />
                  <div key={product.id} className="product_icons">
                    <div
                      className="icon-heart"
                      onClick={() => handleHeartClick(index + middleIndex)}
                    >
                      {heartedItems[index + middleIndex] ? (
                        <FaHeart className="fas" />
                      ) : (
                        <FaRegHeart className="fa" />
                      )}
                    </div>
                    <div
                      className="icon-eye"
                      onClick={() => handleEyeClick(index + middleIndex)}
                    >
                      {eyedItems[index + middleIndex] ? (
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
                <div className="product_detal flex flex-col">
                  <h3>{product.name}</h3>
                  <div className="info flex flex-row gap-1 items-center">
                    <span className="price">{product.price}</span>
                    <div className="rating">
                      <div className="rating_icon flex flex-row items-center">
                        <ProductRating product={product} />
                      </div>
                    </div>
                    <span className="reviews">
                      ({product.rating?.toFixed(1) ?? "N/A"})
                    </span>
                  </div>
                  <div className="color-var flex flex-row gap-2 items-center relative">
                    {colors.map((color) => (
                      <div
                        key={color}
                        className={`color-item ${color} ${
                          activeColors[index + middleIndex] === color
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          handleColorChange(index + middleIndex, color)
                        }
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="category_btn flex items-center justify-center">
        <span>View All Products</span>
      </div>
    </div>
  );
}

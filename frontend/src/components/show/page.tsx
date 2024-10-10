"use client";
import React, {useRef, useState, useMemo, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useCart} from "@/context/commerce logic/cartcontext";
import {useWishContext} from "@/context/commerce logic/view-wishcontext";
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
import { useProductContext } from "@/context/productContext/productcontext";
import { Product } from "@/types/product";
import { ProductNotFound } from "../product-notfound/page";
import { FilterButton } from "../filterbtn";
import Link from "next/link";




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
  const router = useRouter();
  const {addToCart} = useCart();
  const {products, loading} = useProductContext();
  const {
    wishlist,
    viewedProducts,
    addToWishlist,
    addToViewed,
    removeFromViewlist,
    removeFromWishlist,
  } = useWishContext();
  const [heartedItems, setHeartedItems] = useState<boolean[]>([]);
  const [eyedItems, setEyedItems] = useState<boolean[]>([]);
  const [activeColors, setActiveColors] = useState<string[]>(
    Array(16).fill("red")
  );

  // Create two separate refs for each grid
  const topGridRef = useRef<HTMLDivElement>(null);
  const bottomGridRef = useRef<HTMLDivElement>(null);

  // Memoize filtered products
  const topProducts = useMemo(() => {
    const topFilProducts = products.filter((product) => product.top === true);
    const topDisProducts = topFilProducts.slice(0, 16);
    const middleIndex = Math.ceil(topDisProducts.length / 2);

    return {
      top: topDisProducts.slice(0, middleIndex),
      bottom: topDisProducts.slice(middleIndex),
    };
  }, [products]);

  const colors = ["red", "orange", "yellow", "black"];
  

 useEffect(() => {
   if (wishlist && viewedProducts) {
     const updatedHeartedItemsTop = topProducts.top.map((product) =>
       wishlist.some((wishItem) => wishItem._id === product._id)
     );
     const updatedEyedItemsTop = topProducts.top.map((product) =>
       viewedProducts.some((viewedItem) => viewedItem._id === product._id)
     );

     const updatedHeartedItemsBottom = topProducts.bottom.map((product) =>
       wishlist.some((wishItem) => wishItem._id === product._id)
     );
     const updatedEyedItemsBottom = topProducts.bottom.map((product) =>
       viewedProducts.some((viewedItem) => viewedItem._id === product._id)
     );

     const allHeartedItems = [
       ...updatedHeartedItemsTop,
       ...updatedHeartedItemsBottom,
     ];
     const allEyedItems = [...updatedEyedItemsTop, ...updatedEyedItemsBottom];

     setHeartedItems((prevHeartedItems: boolean[]) => {
       if (
         JSON.stringify(allHeartedItems) !== JSON.stringify(prevHeartedItems)
       ) {
         return allHeartedItems;
       }
       return prevHeartedItems;
     });

     setEyedItems((prevEyedItems: boolean[]) => {
       if (JSON.stringify(allEyedItems) !== JSON.stringify(prevEyedItems)) {
         return allEyedItems;
       }
       return prevEyedItems;
     });
   }
 }, [topProducts, wishlist, viewedProducts]);

  const handleIconClick = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault(); // Prevent navigation when clicking icons
    e.stopPropagation(); // Prevent event bubbling
    callback();
  };

  if (loading) {
    return <FetchLoader />; // Display loading component while fetching
  }

  if (!products || products.length === 0) {
    return <ProductNotFound />;
  }

  const handleColorChange = (index: number, color: string) => {
    setActiveColors((prev) => {
      const updated = [...prev];
      updated[index] = color;
      return updated;
    });
  };

  

  const handleHeartClick = (index: number, product: Product) => {
    setHeartedItems((prev: boolean[]) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      if (updated[index]) {
        addToWishlist(product);
      } else {
        removeFromWishlist(product._id);
      }
      return updated;
    });
  };

  const handleEyeClick = (index: number, product: Product) => {
    setEyedItems((prev: boolean[]) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      if (updated[index]) {
        addToViewed(product);
      } else {
        removeFromViewlist(product._id);
      }
      return updated;
    });
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation when adding to cart
    addToCart(product);
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
          {topProducts.top.map((product, index) => {
            // console.log("Rendering product: ", product);

            return (
              <div className="top_item" key={product._id}>
                <Link href={`/show/${product._id}`}>
                  <div className="product_image">
                    <Image
                      alt={product.name}
                      width={200}
                      height={300}
                      src={product.mainImage || "/default-image.jpg"} // Ensure a default image
                    />
                    <div key={`icons-${product.id}`} className="product_icons">
                      <div
                        className="icon-heart"
                        onClick={(e) =>
                          handleIconClick(e, () =>
                            handleHeartClick(index, product)
                          )
                        }
                      >
                        {heartedItems[index] ? (
                          <FaHeart className="fas" />
                        ) : (
                          <FaRegHeart className="fa" />
                        )}
                      </div>
                      <div
                        className="icon-eye"
                        onClick={(e) =>
                          handleIconClick(e, () =>
                            handleEyeClick(index, product)
                          )
                        }
                      >
                        {eyedItems[index] ? (
                          <FaEye className="fas" />
                        ) : (
                          <FaRegEye className="fa" />
                        )}
                      </div>
                    </div>
                    <div
                      className="product_btn"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
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
                </Link>
              </div>
            );
          })}
        </div>
        <div
          className="bottom_grid flex flex-row overflow-x-auto"
          ref={bottomGridRef}
        >
          {topProducts.bottom.map((product, index) => {
            // console.log("Rendering product: ", product);

            return (
              <div className="top_item" key={product._id}>
                <Link href={`/show/${product._id}`}>
                  <div className="product_image">
                    <Image
                      alt={product.name}
                      width={200}
                      height={300}
                      src={product.mainImage || "/default-image.jpg"} // Ensure a default image
                    />
                    <div key={`icons-${product.id}`} className="product_icons">
                      <div
                        className="icon-heart"
                        onClick={(e) =>
                          handleIconClick(e, () =>
                            handleHeartClick(index, product)
                          )
                        }
                      >
                        {heartedItems[index + topProducts.top.length] ? (
                          <FaHeart className="fas" />
                        ) : (
                          <FaRegHeart className="fa" />
                        )}
                      </div>
                      <div
                        className="icon-eye"
                        onClick={(e) =>
                          handleIconClick(e, () =>
                            handleEyeClick(index, product)
                          )
                        }
                      >
                        {eyedItems[index + topProducts.top.length] ? (
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
                            activeColors[index + topProducts.top.length] ===
                            color
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleColorChange(
                              index + topProducts.top.length,
                              color
                            )
                          }
                        ></div>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="category_btn flex items-center justify-center"
        onClick={() => router.push("/today")}
      >
        <FilterButton tag="top" />
      </div>
    </div>
  );
}

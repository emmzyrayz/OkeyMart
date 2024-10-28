"use client";
import React, {useRef, useState, useMemo, useEffect, useCallback} from "react";
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
import {CartItem} from "../../context/commerce logic/cartcontext";

const getProductId = (product: Product): string | null => {
  return product._id || product.id || null;
};

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
    // wishlist,
    viewedProducts,
    addToWishlist,
    addToViewed,
    removeFromWishlist,
    removeFromViewlist,
    isInWishlist, // Use the isInWishlist function from context
  } = useWishContext();

  const [selectedColor] = useState("purple");
  const [selectedSize] = useState("M");
  const [quantity] = useState(1);
  const [activeColors, setActiveColors] = useState<string[]>([]);

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

  // Initialize activeColors when products load
  useEffect(() => {
    setActiveColors(
      Array(topProducts.top.length + topProducts.bottom.length).fill("red")
    );
  }, [topProducts]);

  const colors = ["red", "orange", "yellow", "black"];

  const handleIconClick = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  const handleHeartClick = useCallback(
    (product: Product, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const productId = getProductId(product);
      if (productId) {
        if (isInWishlist(productId)) {
          removeFromWishlist(productId);
        } else {
          addToWishlist(product);
        }
      }
    },
    [addToWishlist, removeFromWishlist, isInWishlist]
  );

  const handleEyeClick = useCallback(
    (product: Product, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const productId = getProductId(product);
      if (productId) {
        const isViewed = viewedProducts.some(
          (item) => getProductId(item) === productId
        );
        if (isViewed) {
          removeFromViewlist(productId);
        } else {
          addToViewed(product);
        }
      }
    },
    [addToViewed, removeFromViewlist, viewedProducts]
  );

  const handleAddToCart = useCallback(
    (e: React.MouseEvent, product: Product) => {
      e.preventDefault();
      const cartItem: CartItem = {
        ...product,
        selectedColor,
        selectedSize,
        quantity,
      };
      addToCart(cartItem);
    },
    [addToCart, selectedColor, selectedSize, quantity]
  );

  const handleColorChange = (index: number, color: string) => {
    setActiveColors((prev) => {
      const updated = [...prev];
      updated[index] = color;
      return updated;
    });
  };

  const scrollLeft = () => {
    topGridRef.current?.scrollBy({left: -200, behavior: "smooth"});
    bottomGridRef.current?.scrollBy({left: -200, behavior: "smooth"});
  };

  const scrollRight = () => {
    topGridRef.current?.scrollBy({left: 200, behavior: "smooth"});
    bottomGridRef.current?.scrollBy({left: 200, behavior: "smooth"});
  };

  if (loading) return <FetchLoader />;
  if (!products || products.length === 0) return <ProductNotFound />;


  const renderProductGrid = (products: Product[], startIndex: number = 0) =>
    products.map((product, index) => {
      const productId = getProductId(product);
      if (!productId) return null; 

      return (
        <div className="top_item" key={productId}>
          {productId && (
            <Link href={`/top/${productId}`}>
              <div className="product_image">
                <Image
                  alt={product.name}
                  width={200}
                  height={300}
                  src={product.mainImage || "/default-image.jpg"}
                />
                <div className="product_icons">
                  <div
                    className="icon-heart"
                    onClick={(e) => handleHeartClick(product, e)}
                  >
                    {isInWishlist(productId) ? (
                      <FaHeart className="fas" />
                    ) : (
                      <FaRegHeart className="fa" />
                    )}
                  </div>
                  <div
                    className="icon-eye"
                    onClick={(e) => handleHeartClick(product, e)}
                  >
                    {viewedProducts.some(
                      (item) => getProductId(item) === productId
                    ) ? (
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
                    <ProductRating product={product} />
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
                        activeColors[startIndex + index] === color
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleColorChange(startIndex + index, color)
                      }
                    ></div>
                  ))}
                </div>
              </div>
            </Link>
          )}
        </div>
      );
    });

 

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
          {renderProductGrid(topProducts.top)}
        </div>
        <div
          className="bottom_grid flex flex-row overflow-x-auto"
          ref={bottomGridRef}
        >
          {renderProductGrid(topProducts.bottom, topProducts.top.length)}
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

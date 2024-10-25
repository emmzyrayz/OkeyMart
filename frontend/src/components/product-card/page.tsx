"use client";

import Image from "next/image";
import {
  FaHeart,
  FaRegHeart,
  FaEye,
  FaRegEye,
  FaRegStar,
  FaStar,
  FaStarHalf,
} from "react-icons/fa";
import "./prod-card.css";
import {useCallback, useState} from "react";
import React from "react";
import {useRouter} from "next/navigation";
import {Product} from "@/types/product";
import {useCart} from "@/context/commerce logic/cartcontext";
// import Link from "next/link";
import { CartItem } from '../../context/commerce logic/cartcontext';
import { useWishContext } from "@/context/commerce logic/view-wishcontext";

type ProductCardProps = {
  product: Product;
  filterTag: string;
};

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating); // Full stars
  const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Half star if applicable
  const emptyStars = 5 - fullStars - halfStars; // Remaining empty stars

  const stars = [];

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="fa-star" />);
  }

  // Add half star
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

const ProductRating = ({rating}: {rating: number}) => {
  const ratting = rating ?? 0;

  return (
    <div className="rating_icon flex flex-row items-center">
      {renderStars(ratting)}
    </div>
  );
};

export const ProductCard = ({product, filterTag}: ProductCardProps) => {
  const {addToCart} = useCart();
  const router = useRouter();
  const [selectedColor ] = useState("purple");
  const [selectedSize] = useState("M");
  const [quantity] = useState(1);
  const {
    // wishlist,
    viewedProducts,
    addToWishlist,
    addToViewed,
    removeFromViewlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishContext();
  // const [isFavorite, setIsFavorite] = useState(isInWishlist(product._id));


   const handleHeartClick = useCallback(
     (product: Product, e: React.MouseEvent) => {
       e.preventDefault();
       e.stopPropagation();

       if (isInWishlist(product._id)) {
         removeFromWishlist(product._id);
       } else {
         addToWishlist(product);
       }
     },
     [addToWishlist, removeFromWishlist, isInWishlist]
   );

   const handleEyeClick = useCallback(
     (product: Product, e: React.MouseEvent) => {
       e.preventDefault();
       e.stopPropagation();

       const isViewed = viewedProducts.some((item) => item._id === product._id);
       if (isViewed) {
         removeFromViewlist(product._id);
       } else {
         addToViewed(product);
       }
     },
     [addToViewed, removeFromViewlist, viewedProducts]
   );
  const handleViewItemClick = () => {
    
    if (!product._id) {
      console.error("Product ID is undefined:", product);
      return;
    }

    // Use the correct ID field from your product object
    const productId = product._id;
    const url = `/${filterTag}/${productId}`;
    console.log("Navigating to:", url);
    router.push(url);
  };

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

  

  return (
    <>
      <div className="product_item mb-6" key={product._id}>
        <div className="product_image">
          <span className="discount">{product.discount}%</span>
          <Image
            alt={product.name}
            width={200}
            height={300}
            src={product.mainImage}
          />
          <div className="product_icons">
            <div
              className="icon-heart"
              onClick={(e) => handleHeartClick(product, e)}
            >
              {isInWishlist(product._id) ? (
                <FaHeart className="fas" />
              ) : (
                <FaRegHeart className="fa" />
              )}
            </div>
            <div
              className="icon-eye"
              onClick={(e) => handleEyeClick(product, e)}
            >
              {viewedProducts.some((item) => item._id === product._id) ? (
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
        <div className="product_detail">
          <div className="product_name">{product.name}</div>
          <div className="product_price">
            <div className="dscount_price">
              ${(product.price * (1 - product.discount / 100)).toFixed(2)}
            </div>
            <div className="actual_price">${product.price}</div>
          </div>
          <div className="rating">
            <div className="rating_icon flex flex-row items-center">
              <ProductRating rating={product.rating} />{" "}
              {/* Rating as a number */}
            </div>
            <div className="rating_number">
              ({product.rating?.toFixed(1) ?? "N/A"})
            </div>
          </div>
          <div
            className="det_btn flex flex-row items-center justify-center bg-[--secondary2] rounded-md h-[43px] hover:bg-[--btn-hover] text-[--text] w-full"
            onClick={handleViewItemClick}
          >
            <span>View Item</span>
          </div>
        </div>
      </div>
    </>
  );
};

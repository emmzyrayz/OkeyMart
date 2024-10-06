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
import {useState} from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { ProductType } from "@/types/product";
import Link from "next/link";


type ProductCardProps = {
  product: ProductType;
  filterTag: string;
}

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
  const [hearted, setHearted] = useState(false); // Single state for heart icon
  const [eyed, setEyed] = useState(false); // Single state for eye icon
  const router = useRouter();

  // Handlers no longer need an index, just toggle states
  const handleHeartClick = () => {
    setHearted(!hearted);
  };

  const handleEyeClick = () => {
    setEyed(!eyed);
  };

  const handleViewItemClick = (id: string) => {
    router.push(`/${filterTag}/${id}`);
  };

  return (
    <>
      <div className="product_item mb-6" key={product.id}>
        <div className="product_image">
          <span className="discount">{product.discount}%</span>
          <Image
            alt={product.name}
            width={200}
            height={300}
            src={product.mainImage}
          />
          <div className="product_icons">
            <div className="icon-heart" onClick={handleHeartClick}>
              {hearted ? (
                <FaHeart className="fas" />
              ) : (
                <FaRegHeart className="fa" />
              )}
            </div>
            <div className="icon-eye" onClick={handleEyeClick}>
              {eyed ? <FaEye className="fas" /> : <FaRegEye className="fa" />}
            </div>
          </div>
          <div className="product_btn">
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
            onClick={() => handleViewItemClick(product.id)}
          >
            <span>View Item</span>
          </div>
        </div>
      </div>
    </>
  );
};

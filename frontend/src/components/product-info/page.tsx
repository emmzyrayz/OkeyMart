import Image from "next/image";
import "./product.css";
import {
  FaPlus,
  FaMinus,
  FaRegHeart,
  FaStarHalf,
  FaRegStar,
  FaStar,
  FaHeart,
} from "react-icons/fa6";
import {TbTruckDelivery} from "react-icons/tb";
import {PiArrowsCounterClockwise} from "react-icons/pi";
import {Product} from "@/types/product";
// import Link from "next/link";
import { useWishContext } from "@/context/commerce logic/view-wishcontext";
import { useState } from "react";
import { useCart, CartItem } from "@/context/commerce logic/cartcontext";

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

export const ProductInfo = ({product}: {product: Product}) => {
  const {category} = product;
  const {addToWishlist, removeFromWishlist, isInWishlist} = useWishContext();
  const {addToCart} = useCart();

  // State variables for color, size, quantity, and favorite status
  const [selectedColor, setSelectedColor] = useState("purple");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(isInWishlist(product._id));


  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleFavoriteToggle = () => {
    setIsFavorite((prev) => {
      const newFavoriteStatus = !prev;
      if (newFavoriteStatus) {
        addToWishlist(product);
      } else {
        removeFromWishlist(product._id);
      }
      return newFavoriteStatus;
    });
  };

  const handleAddToCart = () => {
    const productWithDetails: CartItem = {
      ...product,
      selectedColor,
      selectedSize,
      quantity,
    };
    addToCart(productWithDetails);
  };


  return (
    <div className="product-info_section flex flex-col items-center justify-center w-full h-full">
      <div className="productinfo_top flex flex-row mb-2 items-start justify-start w-full h-full outline-red-400">
        <div className="profile_nav flex flex-row gap-1 items-start justify-start">
          <span className="faint">Home</span>
          <span className="faint">/</span>
          <span className="faint">{category}</span>
          <span className="faint">/</span>
          <span className="full">{product.name}</span>
        </div>
      </div>
      <div className="product-info_container flex flex-row items-center justify-center gap-5">
        <div className="product-info_image flex flex-row items-center justify-center mr-2 w-2/3">
          <div className="image_items flex flex-col items-center justify-center w-1/3 gap-3">
            {product.images.map((img, index) => (
              <div key={index} className="image_item">
                <Image src={img} alt={product.name} width={100} height={100} />
              </div>
            ))}
          </div>
          <div className="product_disp flex items-center justify-center w-2/3 ">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={500}
              height={500}
              className="display_image"
            />
          </div>
        </div>
        <div className="product-info_det flex flex-col items-center justify-start w-1/3 gap-1">
          <div className="det_top flex flex-col items-start justify-center">
            <h1 className="det_name">{product.name}</h1>
            <span className="det_rating-con flex flex-row items-center justify-center gap-1">
              <span className="det_rating flex flex-row items-center justify-center gap-1">
                <div className="rating_icon flex flex-row items-center">
                  <ProductRating rating={product.rating} />
                </div>
                <p>({product.rating?.toFixed(1) ?? "N/A"}) Reviews</p>
              </span>
              <p>|</p>
              <span className="det_stock">In Stock</span>
            </span>
            <span className="det_price">${product.price}</span>
            <div className="det_sum">{product.description}</div>
          </div>
          <hr />
          <div className="det_bottom flex flex-col items-start justify-center">
            <div className="det_color flex flex-row items-center justify-center">
              <span className="colo-name">Colours:</span>
              <div className="colors flex flex-row items-center justify-center">
                {["purple", "orange", "green", "cream"].map((color) => (
                  <div
                    key={color}
                    className={`color ${color} ${
                      selectedColor === color ? "active" : ""
                    }`}
                    onClick={() => handleColorChange(color)}
                  ></div>
                ))}
              </div>
            </div>
            <div className="det_sizes flex flex-row items-center justify-center">
              <span className="size-name">Size:</span>
              <div className="sizes flex flex-row">
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <div
                    key={size}
                    className={`size ${selectedSize === size ? "active" : ""}`}
                    onClick={() => handleSizeChange(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
            <div className="det_calc flex flex-row items-center justify-center gap-2">
              <div className="det_quantity flex flex-row items-center justify-between">
                <div className="quant_icons border-right">
                  <FaMinus className="quant_icon" onClick={decreaseQuantity} />
                </div>
                <span className="quant_digit">{quantity}</span>
                <div className="quant_icons border-left">
                  <FaPlus className="quant_icon" onClick={increaseQuantity} />
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="cursor-pointer block"
              >
                <div className="det_btn flex flex-row">
                  <span>Add to cart</span>
                </div>
              </button>
              <div className="det_fav flex flex-row">
                {isFavorite ? (
                  <FaHeart
                    className="quant_iconsst"
                    onClick={handleFavoriteToggle}
                  />
                ) : (
                  <FaRegHeart
                    className="quant_icon"
                    onClick={handleFavoriteToggle}
                  />
                )}
              </div>
            </div>
            <div className="det_bonus flex flex-col">
              <div className="det_deliver flex flex-row items-center justify-start gap-2">
                <div className="deliv_icon">
                  <TbTruckDelivery className="quant_icon" />
                </div>
                <div className="text">
                  <h2>Free Delivery</h2>
                  <p>Enter your postal code for delievry availability</p>
                </div>
              </div>
              <div className="det_return flex flex-row items-center justify-start gap-2">
                <div className="deliv_icon">
                  <PiArrowsCounterClockwise className="quant_icon" />
                </div>
                <div className="text">
                  <h2>Return Delievry</h2>
                  <p>
                    Free 30 days delivery returns. <span>Details</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

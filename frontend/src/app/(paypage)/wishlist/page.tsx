'use client'
import "./wish.css";
import Image from "next/image";
import {useWishContext} from "@/context/commerce logic/view-wishcontext";
import {useCart} from "@/context/commerce logic/cartcontext";
import {FaStar, FaStarHalf, FaRegStar } from "react-icons/fa6";
import {RiDeleteBinLine} from "react-icons/ri";
import {CiShoppingCart} from "react-icons/ci";
import { Product } from "@/types/product";

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
  return (
    <div className="rating_icon flex flex-row items-center">
      {renderStars(product.rating)} {/* Call the renderStars function */}
    </div>
  );
};

export default function WishList() {
  const {wishlist, viewedProducts, removeFromViewlist, removeFromWishlist} = useWishContext();
  const {addToCart} = useCart();

  const handleAddToCart = () => {
    wishlist.forEach((product) => addToCart(product));
    alert("All wishlist items added to cart!");
  };


  return (
    <div className="wishlist_section flex flex-col items-center w-full h-full mb-9">
      <div className="wishlist_container flex flex-col items-start justify-center gap-5 w-full">
        <div className="wish_head flex flex-row w-full items-center justify-between">
          <h2>Wishlist</h2>
          <div
            className="btn_w flex items-center justify-center hover:bg-[--text1] hover:text-[--text] cursor-pointer"
            onClick={handleAddToCart}
          >
            Move All To Bag
          </div>
        </div>

        {wishlist.length === 0 ? (
          <p>Your wishlist is empty</p>
        ) : (
          <div className="wish_items flex flex-row overflow-x-auto gap-5">
            {wishlist.map((product) => (
              <div key={product.id} className="wish_item flex flex-col gap-3">
                <div className="item_img flex flex-col relative">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    width={100}
                    className="Image"
                    height={300}
                  />
                  <div className="discount absolute">-{product.discount}%</div>
                  <span
                    className="bbin"
                    onClick={() => removeFromWishlist(product._id)}
                  >
                    <RiDeleteBinLine className="bin" />
                  </span>
                  <span
                    className="ccart flex flex-row items-center justify-center gap-2 absolute"
                    onClick={() => addToCart(product)}
                  >
                    <CiShoppingCart className="cart" /> <span>Add To Cart</span>
                  </span>
                </div>
                <div className="item_desc flex flex-col items-start justify-center">
                  <h3>{product.name}</h3>
                  <div className="price flex flex-row gap-2">
                    <span className="disc_price">
                      $
                      {(
                        product.price *
                        (1 - (product.discount ?? 0) / 100)
                      ).toFixed(2)}
                    </span>
                    <span className="act_price">${product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="wishlist_foryou flex flex-col items-start justify-center gap-5 w-full">
        <div className="wish_head flex flex-row w-full items-center justify-between">
          <div className="today_top flex flex-row items-center gap-3">
            <div className="today_red"></div>
            <h2 className="h2">Viewed</h2>
          </div>
          <div className="btn_w flex items-center justify-center hover:bg-[--text1] hover:text-[--text] cursor-pointer">
            See All
          </div>
        </div>
        {viewedProducts.length === 0 ? (
          <p>You have not viewed any products yet</p>
        ) : (
          <div className="wish_items flex flex-row overflow-x-auto gap-5">
            {viewedProducts.map((product) => (
              <div className="wish_item flex flex-col gap-3" key={product.id}>
                <div className="item_img flex flex-col relative">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    width={100}
                    className="Image"
                    height={300}
                  />
                  <div className="discount absolute">-{product.discount}%</div>
                  <span
                    className="bbin hover:bg-[]"
                    onClick={() => removeFromViewlist(product._id)}
                  >
                    <RiDeleteBinLine className="bin" />
                  </span>
                  <span
                    className="ccart flex flex-row items-center justify-center gap-2 absolute"
                    onClick={handleAddToCart}
                  >
                    <CiShoppingCart className="cart" /> <span>Add To Cart</span>
                  </span>
                </div>
                <div className="item_desc flex flex-col items-start justify-center">
                  <h3>{product.name}</h3>
                  <div className="price flex flex-row gap-2">
                    <span className="disc_price">
                      $
                      {(
                        product.price *
                        (1 - (product.discount ?? 0) / 100)
                      ).toFixed(2)}
                    </span>
                    <span className="act_price">${product.price}</span>
                  </div>
                  <div className="rating">
                    <div className="rating_icon flex flex-row items-center">
                      <ProductRating product={product} />{" "}
                      {/* Render the rating */}
                    </div>
                    <div className="rating_number">
                      ({product.rating.toFixed(1)})
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

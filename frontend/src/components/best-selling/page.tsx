"use client";
import React, {useEffect, useState} from "react";
import {
  FaEye,
  FaHeart,
  FaRegEye,
  FaRegHeart,
  FaRegStar,
  FaStar,
  FaStarHalf,
} from "react-icons/fa";
import Image from "next/image";
import "./best-selling.css";
import FetchLoader from "../fetchloading/page";
import {useProductContext} from "@/context/productContext/productcontext";
import {useCart} from "@/context/commerce logic/cartcontext";
import {Product} from "@/types/product";
import {useRouter} from "next/navigation";
import { ProductNotFound } from "../product-notfound/page";
import {useWishContext} from "@/context/commerce logic/view-wishcontext";
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
  return (
    <div className="rating_icon flex flex-row items-center">
      {renderStars(product.rating)} {/* Call the renderStars function */}
    </div>
  );
};

export const BestSelling = () => {
  const router = useRouter();
   const {addToCart} = useCart();
  const {loading: globalLoading} = useProductContext();
  const {addToWishlist, addToViewed} = useWishContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [heartedItems, setHeartedItems] = useState<boolean[]>([]);
  const [eyedItems, setEyedItems] = useState<boolean[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  
  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      setLocalLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();

      // Filter products with today set to true
      const todayProducts = data.filter(
        (product: Product) => product.trending === true
      );

      // Limit to 10 today products
      const limitedTodayProducts = todayProducts.slice(0, 10);

      // Set state with only the limited products
      setProducts(limitedTodayProducts);
      setHeartedItems(Array(limitedTodayProducts.length).fill(false));
      setEyedItems(Array(limitedTodayProducts.length).fill(false));
      
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLocalLoading(false);
    }
  };


  const handleIconClick = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault(); // Prevent navigation when clicking icons
    e.stopPropagation(); // Prevent event bubbling
    callback();
  };

  useEffect(() => {
    fetchProducts();
  }, [])

   if (globalLoading || localLoading) {
     return <FetchLoader />; // Display loading component while fetching
   }

   if (products.length === 0) {
     return <ProductNotFound />;
   }

   const removeFromViewlist = (index: number, listType: "heart" | "eye") => {
     if (listType === "heart") {
       setHeartedItems((prev) => {
         const updated = [...prev];
         updated[index] = false; // Unset heart (remove from wishlist)
         return updated;
       });
     } else if (listType === "eye") {
       setEyedItems((prev) => {
         const updated = [...prev];
         updated[index] = false; // Unset eye (remove from viewed products)
         return updated;
       });
     }
   };

   const handleHeartClick = (index: number, product: Product) => {
     setHeartedItems((prev) => {
       const updated = [...prev];
       updated[index] = !updated[index]; // Toggle the heart state
       if (updated[index]) {
         addToWishlist(product); // Add to wishlist if liked
       } else {
         removeFromViewlist(index, "heart"); // Remove from wishlist
       }
       return updated;
     });
   };

   const handleEyeClick = (index: number, product: Product) => {
     setEyedItems((prev) => {
       const updated = [...prev];
       updated[index] = !updated[index]; // Toggle the eye state
       if (updated[index]) {
         addToViewed(product); // Add to viewed products if viewed
       } else {
         removeFromViewlist(index, "eye"); // Remove from viewed products
       }
       return updated;
     });
   };

   const handleAddToCart = (e: React.MouseEvent, product: Product) => {
     e.preventDefault(); // Prevent navigation when adding to cart
     addToCart(product);
     alert(`${product.name} added to cart!`);
   };

  return (
    <div className="best_section">
      <div className="best_top flex flex-row items-center gap-2">
        <div className="best_red"></div>
        <h2>This Month</h2>
      </div>
      <div className="best_header flex flex-row w-full">
        <div className="best-title">
          <span>Best Selling Products</span>
        </div>
        <div
          className="best_btn flex flex-row items-center justify-center"
          onClick={() => router.push("/trending")}
        >
          <span>View All</span>
        </div>
      </div>
      <div className="best_product flex flex-row overflow-x-auto">
        {products.map((product, index) => {
          const discountPrice = product.price * (1 - product.discount / 100);

          return (
            <div className="product_item" key={index}>
              <Link href={`/trending/${product._id}`}>
                <div className="product_image">
                  <span className="discount hidden">{product.discount}</span>
                  <Image
                    alt={`product ${index + 1}`}
                    width={200}
                    height={300}
                    src={product.mainImage}
                  />
                  <div className="product_icons">
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
                        handleIconClick(e, () => handleEyeClick(index, product))
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
                <div className="product_detail">
                  <div className="product_name">{product.name}</div>
                  <div className="product_price">
                    <div className="dscount_price">
                      ${discountPrice.toFixed(2)}
                    </div>
                    <div className="actual_price">${product.price}</div>
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
              </Link>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

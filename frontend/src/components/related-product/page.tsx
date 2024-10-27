import {useCallback, useEffect, useState} from "react";
import {
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaRegHeart,
  FaRegEye,
  FaEye,
  FaHeart,
} from "react-icons/fa6";
import Image from "next/image";
import FetchLoader from "../fetchloading/page";
import {Product} from "@/types/product";
import {useProductContext} from "@/context/productContext/productcontext";
import {ProductNotFound} from "../product-notfound/page";
import {CartItem, useCart} from "@/context/commerce logic/cartcontext";
import {useWishContext} from "@/context/commerce logic/view-wishcontext";

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

const RelatedProductsList = () => {
  const {addToCart} = useCart();
  const {products, loading} = useProductContext();
  const {
    // wishlist,
    viewedProducts,
    addToWishlist,
    addToViewed,
    removeFromViewlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishContext();
  const [selectedColor] = useState("purple");
  const [selectedSize] = useState("M");
  const [quantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!loading && products.length > 0) {
      // Filter the products with `top = true` and randomly pick 10
      const topProducts = products
        .filter((product) => product.top === true)
        .sort(() => 0.5 - Math.random()) // Shuffle array
        .slice(0, 10); // Pick the first 10 items after shuffle
      setRelatedProducts(topProducts);
    }
  }, [products, loading]);

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

  if (loading) {
    return <FetchLoader />; // Display loading component while fetching
  }

  if (!relatedProducts.length) {
    return <ProductNotFound />;
  }

  return (
    <div className="related_items flex flex-row overflow-x-auto mb-8 px-4">
      {relatedProducts.map((product) => (
        <div key={product._id} className="related_item">
          <div className="product_image">
            <span className="discount">
              -{((1 - product.discount / product.price) * 100).toFixed(0)}%
            </span>
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
              <div className="dscount_price">${product.discount}</div>
              <div className="actual_price">${product.price}</div>
            </div>
            <div className="rating">
              <div className="rating_icon flex flex-row items-center">
                <ProductRating rating={product.rating} />
              </div>
              <div className="rating_number">
                ({product.rating?.toFixed(1) ?? "N/A"})
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelatedProductsList;

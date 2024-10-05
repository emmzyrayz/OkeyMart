import {useEffect, useState} from "react";
import { FaStar, FaStarHalf, FaRegStar, FaRegHeart, FaRegEye } from "react-icons/fa6";
import Image from "next/image";
import FetchLoader from "../fetchloading/page";
import { Product, ProductType } from "@/types/product";
import {useProductContext} from "@/context/productContext/productcontext";
import { ProductNotFound } from "../product-notfound/page";








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

const RelatedProductsList = ({currentCategory}: {currentCategory: string}) => {
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);

  const {loading: globalLoading} = useProductContext();
  const [localLoading, setLocalLoading] = useState(true);

  const fetchRelatedProducts = async (
    category: string
  ): Promise<ProductType[]> => {
    try {
      setLocalLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();

      // Filter products with related set to true
      const RelatedProducts = data.filter((product: Product) =>
        product.categories.some((cat) => cat.name === category)
      );

      // Limit to 10 related products
      return RelatedProducts.slice(0, 10).map((product: Product) => ({
        ...product,
        categories: product.categories.map((cat) => cat.name).join(", "),
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    const getRelatedProducts = async () => {
        setLocalLoading(true);
      const products = await fetchRelatedProducts(currentCategory);
      setRelatedProducts(products);
      setLocalLoading(false);
    };
    getRelatedProducts();
  }, [currentCategory]);

  if (globalLoading || localLoading) {
    return <FetchLoader />; // Display loading component while fetching
  }

  if (relatedProducts.length === 0) {
    return <ProductNotFound />;
  }

  return (
    <div className="related_items flex flex-row overflow-x-auto mb-8">
      {relatedProducts.map((product) => (
        <div key={product.id} className="related_item">
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
              <div className="icon-heart">
                <FaRegHeart className="fa" />
              </div>
              <div className="icon-eye">
                <FaRegEye className="fa" />
              </div>
            </div>
            <div className="product_btn">
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
      ;
    </div>
  );
};

export default RelatedProductsList;
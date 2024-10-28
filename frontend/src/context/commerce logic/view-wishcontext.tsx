"use client";
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {Product} from "@/types/product";

// Helper function for getting product ID
const getProductId = (product: Product): string | null => {
  return product._id || product.id || null;
};

type ViewWishContextType = {
  wishlist: Product[];
  viewedProducts: Product[];
  addToWishlist: (product: Product) => void;
  addToViewed: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  removeFromViewlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  clearViewedProducts: () => void;
};

const ViewWishContext = createContext<ViewWishContextType | undefined>(
  undefined
);

export const ViewWishProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);

  const addToWishlist = useCallback((product: Product) => {
    const productId = getProductId(product);
    if (!productId) return; // Skip if no valid ID

    setWishlist((prevWishlist) => {
      if (!prevWishlist.some((item) => getProductId(item) === productId)) {
        return [...prevWishlist, product];
      }
      return prevWishlist;
    });
  }, []);

  const addToViewed = useCallback((product: Product) => {
    const productId = getProductId(product);
    if (!productId) return; // Skip if no valid ID

    setViewedProducts((prevViewedProducts) => {
      if (
        !prevViewedProducts.some((item) => getProductId(item) === productId)
      ) {
        return [product, ...prevViewedProducts].slice(0, 10); // Keep only the last 10 viewed products
      }
      return prevViewedProducts;
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => getProductId(item) !== productId)
    );
  }, []);

  const removeFromViewlist = useCallback((productId: string) => {
    setViewedProducts((prevViewedProducts) =>
      prevViewedProducts.filter((item) => getProductId(item) !== productId)
    );
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => getProductId(item) === productId);
    },
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const clearViewedProducts = useCallback(() => {
    setViewedProducts([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      wishlist,
      viewedProducts,
      addToWishlist,
      addToViewed,
      removeFromWishlist,
      removeFromViewlist,
      isInWishlist,
      clearWishlist,
      clearViewedProducts,
    }),
    [
      wishlist,
      viewedProducts,
      addToWishlist,
      addToViewed,
      removeFromWishlist,
      removeFromViewlist,
      isInWishlist,
      clearWishlist,
      clearViewedProducts,
    ]
  );

  return (
    <ViewWishContext.Provider value={contextValue}>
      {children}
    </ViewWishContext.Provider>
  );
};

export const useWishContext = () => {
  const context = useContext(ViewWishContext);
  if (!context)
    throw new Error(
      "useViewWishContext must be used within a ViewWishProvider"
    );
  return context;
};

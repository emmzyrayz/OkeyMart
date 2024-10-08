// context/commerce logic/view-wishcontext.tsx
'use client'
import React, { createContext, useState, useContext } from 'react';
import { Product } from '@/types/product';

type ViewWishContextType = {
  wishlist: Product[];
  viewedProducts: Product[];
  addToWishlist: (product: Product) => void;
  addToViewed: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  removeFromViewlist: (productId: string) => void;
};

const ViewWishContext = createContext<ViewWishContextType | undefined>(
  undefined
);

export const ViewWishProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);

  const addToWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const isProductInWishlist = prevWishlist.some(
        (item) => item._id === product._id
      );
      if (!isProductInWishlist) {
        return [...prevWishlist, product];
      } else {
        return prevWishlist; // No duplicate, return the previous state
      }
    });
  };

  const addToViewed = (product: Product) => {
    setViewedProducts((prevViewedProducts) => {
      const isProductInViewlist = prevViewedProducts.some(
        (item) => item._id === product._id
      );
      if (!isProductInViewlist) {
        return [...prevViewedProducts, product];
      } else {
        return prevViewedProducts; // No duplicate, return the previous state
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      return prevWishlist.filter((item) => item._id !== productId); // Keep only products that don't match the ID
    });
  }

  const removeFromViewlist = (productId: string) => {
    setViewedProducts((prevViewedProducts) => {
      return prevViewedProducts.filter((item) => item._id !== productId); // Keep only products that don't match the ID
    });
  };

  

  return (
    <ViewWishContext.Provider
      value={{
        wishlist,
        viewedProducts,
        addToWishlist,
        addToViewed,
        removeFromWishlist,
        removeFromViewlist,
      }}
    >
      {children}
    </ViewWishContext.Provider>
  );
};

export const useWishContext = () => {
  const context = useContext(ViewWishContext);
  if (!context) throw new Error("useViewWishContext must be used within a ViewWishProvider");
  return context;
};
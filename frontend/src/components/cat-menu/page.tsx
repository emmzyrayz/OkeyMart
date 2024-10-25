'use client'
import React, {useMemo} from "react";
import Link from "next/link";
import './category.css';
import { FaAngleRight } from "react-icons/fa6";
import {useProductContext} from "@/context/productContext/productcontext";

interface SortCatProps {
  className?: string;
}

export const SortCat: React.FC<SortCatProps> = ({className}) => {
  const {products, loading} = useProductContext();

  // Get unique categories and limit to 10
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category))
    );

    // Sort categories alphabetically and take first 10
    return uniqueCategories.sort((a, b) => a.localeCompare(b)).slice(0, 10);
  }, [products]);

  // Get count of products in each category
  // const categoryCount = useMemo(() => {
  //   return categories.reduce((acc, category) => {
  //     acc[category] = products.filter(
  //       (product) => product.category === category
  //     ).length;
  //     return acc;
  //   }, {} as Record<string, number>);
  // }, [categories, products]);

   if (loading) {
     return (
       <div className={`sortcat_section ${className}`}>
         <div className="sortcat_container">
           <h2 className="relative lg:hidden">Categories</h2>
           {[...Array(5)].map((_, index) => (
             <span key={index}>
               <div className="sortcat_item flex items-center justify-between opacity-50">
                 <span>Loading...</span>
               </div>
             </span>
           ))}
         </div>
       </div>
     );
   }

   if (categories.length === 0) {
     return (
       <div className={`sortcat_section ${className}`}>
         <div className="sortcat_container">
           <h2 className="relative lg:hidden">Categories</h2>
           <span>
             <div className="sortcat_item">No categories available</div>
           </span>
         </div>
       </div>
     );
   }


  return (
    <div className={`sortcat_section ${className}`}>
      <div className="sortcat_container">
        <h2 className="relative lg:hidden">Categories</h2>
        {categories.map((category) => (
          <span key={category} className="sort_spann w-full">
            <Link
              href={`/search/${encodeURIComponent(category)}`}
              className="sortcat_item flex flex-row items-center gap-2 w-full justify-between"
            >
              <p>{category}</p>
              <FaAngleRight />
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
};
'use client'
import React, {useState, useEffect, useRef} from "react";
import Link from "next/link";
import "./offer.css";
import {FaAngleDown} from "react-icons/fa";

export const Offer = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    // Prevent event bubbling
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev); // Proper toggle
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  // Add event listener to close the menu when clicking outside of it
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent clicks inside the dropdown menu from triggering the outside click listener
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex flex-row w-full h-auto offer_section gap-1">
      <div className="offer_container flex flex-row">
        <div className="offer-text flex flex-row gap-1">
          <div className="sale-ad">
            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%
          </div>
          <div className="ad-link underline font-semibold">
            <Link href="#">Shop Now</Link>
          </div>
        </div>

        <div className="offer-text flex flex-row gap-1">
          <div className="sale-ad">Buy 1 Get 1 Free on All Winter Wear!</div>
          <div className="ad-link underline font-semibold">
            <Link href="#">Shop Now</Link>
          </div>
        </div>

        <div className="offer-text flex flex-row gap-1">
          <div className="sale-ad">
            Flash Deal: Extra 20% Off for 24 Hours Only!
          </div>
          <div className="ad-link underline font-semibold">
            <Link href="#">Shop Now</Link>
          </div>
        </div>

        {/* Add more offer-text items as needed */}
      </div>

      <div
        className="language-dropdown gap-1 bg-black flex flex-row items-center justify-center absolute"
        onClick={toggleMenu}
      >
        <div className="lang bg-black">English</div>
        <div className="lang-icon bg-black">
          <FaAngleDown />
        </div>
      </div>

      {/* Language Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          onClick={handleMenuClick}
          className="language-menu absolute flex flex-col items-center"
        >
          <span>French</span>
          <span>Espanol</span>
          <span>Chinese</span>
          <span>Arabic</span>
          <span>Portugese</span>
          <span>German</span>
        </div>
      )}
    </div>
  );
};

"use client";
import {usePathname} from "next/navigation";
import Link from "next/link";
import React, { useState} from "react";
import "./navbar.css";
import {FaSearch, FaRegHeart, FaRegUserCircle} from "react-icons/fa";
import {TiShoppingCart} from "react-icons/ti";
import {FiShoppingBag, FiUser, FiBell} from "react-icons/fi";
import {ImCancelCircle} from "react-icons/im";
import {CiStar} from "react-icons/ci";
import {TbLogout2} from "react-icons/tb";
import { HamburgerMenu } from "../hamburger/page";

export const HomeNav = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen); // Toggle search state
  };

  const navItems = [
    {label: "Home", path: "/"},
    {label: "Contact", path: "/contact"},
    {label: "About", path: "/about"},
    {label: "Sign Up", path: "/signup"},
  ];

  return (
    <div className="homenav_section flex flex-row items-center justify-between relative">
      <div className="logo font-bold w-1/5">
        <Link href="/">
          <span>OKEY-MART</span>
        </Link>
      </div>
      <div className="mobile_icon hidden  flex-row w-3/5  items-center justify-end gap-5">
        <div className="search_icon flex" onClick={toggleSearch}>
          <div className="search flex flex-row relative items-center justify-evenly">
            <FaSearch className="nav-icon absolute right-1" />
          </div>
        </div>
        <HamburgerMenu />
      </div>
      <div className="nav_btn relative w-2/5">
        <ul className="flex flex-row w-full justify-evenly">
          {navItems.map((item, index) => (
            <li key={index} className={pathname === item.path ? "active" : ""}>
              <Link href={item.path}>
                <span>{item.label}</span>
                <hr />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="shop_nav flex flex-row gap-2 items-center justify-evenly w-2/5">
        <div className="search flex flex-row relative rounded-md items-center justify-evenly">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="w-full bg-transparent"
          />
          <FaSearch className="nav-icon absolute right-1" />
        </div>
        <Link href="/wishlist">
          <div className="liked relative">
            <FaRegHeart className="nav-icon" />
            <span className="absolute">2</span>
          </div>
        </Link>
        <Link href="/cart">
          <div className="cart relative">
            <TiShoppingCart className="nav-icon" />
            <span className="absolute">5</span>
          </div>
        </Link>
        <div className="user relative online" onClick={toggleMenu}>
          <FaRegUserCircle className="nav-icon" />
          <span className="absolute"></span>
        </div>
      </div>

      <div
        className={`${
          isMenuOpen ? "open" : "hidden"
        } flex navbar_menu absolute flex-col items-center justify-center`}
      >
        <Link href="/profile">
          <div className="profile">
            <FiUser className="wh" />
            <span>Manage My Account</span>
          </div>
        </Link>
        <div className="order">
          <FiShoppingBag className="wh" />
          <span>My Order</span>
        </div>
        <div className="notification">
          <FiBell className="wh" />
          <span>Notifications</span>
        </div>
        <div className="cancel">
          <ImCancelCircle className="wh" />
          <span>My Cancellations</span>
        </div>
        <div className="reviews">
          <CiStar className="wh" />
          <span>My Reviews</span>
        </div>
        <div className="logout">
          <TbLogout2 className="wh" />
          <span>Logout</span>
        </div>
      </div>

      {/* Search Dropdown */}
      {isSearchOpen && (
        <div className="search-dropdown">
          <input
            type="text"
            placeholder="What are you looking for..."
            className="search-input"
          />
          <ImCancelCircle className="cancel-icon" onClick={toggleSearch} />
        </div>
      )}
    </div>
  );
};

"use client";
import {useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import './ham.css';
import { FaRegHeart } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { FiBell, FiShoppingBag, FiUser } from "react-icons/fi";
import { CiStar } from "react-icons/ci";
import { ImCancelCircle } from "react-icons/im";
import { TbLogout2 } from "react-icons/tb";
import {useCart} from "@/context/commerce logic/cartcontext";
import {useWishContext} from "@/context/commerce logic/view-wishcontext";

export const HamburgerMenu = () => {
  const pathname = usePathname();
  const {cartState} = useCart();
  const {wishlist} = useWishContext();
  const [isOpen, setIsOpen] = useState(false);

  // Toggle menu open/close state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    {label: "Home", path: "/"},
    {label: "Contact", path: "/contact"},
    {label: "About", path: "/about"},
    {label: "Sign Up", path: "/signup"},
  ];

  return (
    <div className="hamburger-container" onClick={toggleMenu}>
      <div className={`hamburger-icon ${isOpen ? "open" : ""}`}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div
        className={`mobile_menu absolute ${
          isOpen ? "menu-open" : "menu-closed"
        }`}
      >
        <ul className="flex flex-col w-full justify-evenly">
          {navItems.map((item, index) => (
            <li key={index} className={pathname === item.path ? "active" : ""}>
              <Link href={item.path}>
                <span>{item.label}</span>
                <hr />
              </Link>
            </li>
          ))}

          <div className="mobile_menu-icons">
            <div className="mobile_shop_nav flex flex-row gap-2 items-center justify-evenly w-2/5">
              <Link href="/wishlist">
                <div className="liked relative">
                  <FaRegHeart className="nav-icon" />
                  {wishlist.length > 0 && (
                    <span className="absolute wishlist-count">
                      {wishlist.length}
                    </span>
                  )}
                </div>
              </Link>
              <Link href="/cart">
                <div className="cart relative">
                  <TiShoppingCart className="nav-icon" />
                  {cartState.itemCount > 0 && (
                    <span className="cart-count absolute">
                      {cartState.itemCount}
                    </span>
                  )}
                </div>
              </Link>
              <Link href="/profile">
                <div className="user relative">
                  <FiUser className="nav-icon" />
                  <span className="absolute"></span>
                </div>
              </Link>
            </div>
          </div>

          <div className="mobile_nav_menu w-full flex flex-col items-center justify-center">
            <Link href="/profile" className="link-wrapper">
              <div className="profile">
                <FiUser className="wh" />
                <span>Manage My Account</span>
              </div>
            </Link>
            <Link href="/cart" className="link-wrapper">
              <div className="order">
                <FiShoppingBag className="wh" />
                <span>My Order</span>
              </div>
            </Link>
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
        </ul>
      </div>
    </div>
  );
};
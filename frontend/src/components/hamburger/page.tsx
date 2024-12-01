"use client";
import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import './ham.css';
import { FaRegHeart } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { FiBell, FiShoppingBag, FiUser } from "react-icons/fi";
import { CiStar } from "react-icons/ci";
import { ImCancelCircle } from "react-icons/im";
import { TbLogout2 } from "react-icons/tb";
import { useShoppingContext } from '../../context/shoppingContext';
import { useUser } from "@/context/userContext/UserContext";

export const HamburgerMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {user, logout} = useUser();
  const {cartState, wishlist} = useShoppingContext();
  const {isAuthenticated, role} = user;

  // Toggle menu open/close state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Dynamic navigation items based on authentication and role
  const getNavItems = () => {
    const baseItems = [
      {label: "Home", path: "/"},
      {label: "Contact", path: "/contact"},
      {label: "About", path: "/about"},
    ];

    if (!isAuthenticated) {
      return [...baseItems, {label: "Sign Up", path: "/signup"}];
    }

    if (role === "Buyer") {
      return [
        ...baseItems,
        {label: "My Orders", path: "/orders"},
        {label: "Wishlist", path: "/wishlist"},
      ];
    }

    if (role === "Seller") {
      return [
        ...baseItems,
        {label: "My Store", path: "/store"},
        {label: "Products", path: "/products"},
      ];
    }

    return baseItems;
  };

  // Dynamic user menu items based on role
  const getUserMenuItems = () => {
    const baseItems = [
      {
        label: "Manage My Account",
        icon: FiUser,
        path: "/profile",
      },
      {
        label: "Notifications",
        icon: FiBell,
        path: "/notifications",
      },
    ];

    if (role === "Buyer") {
      return [
        ...baseItems,
        {
          label: "My Orders",
          icon: FiShoppingBag,
          path: "/orders",
        },
        {
          label: "My Reviews",
          icon: CiStar,
          path: "/reviews",
        },
        {
          label: "My Cancellations",
          icon: ImCancelCircle,
          path: "/cancellations",
        },
      ];
    }

    if (role === "Seller") {
      return [
        ...baseItems,
        {
          label: "Manage Products",
          icon: FiShoppingBag,
          path: "/manage-products",
        },
      ];
    }

    return baseItems;
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Close the menu after logout
      setIsOpen(false);
      // Optionally redirect to home or login page
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = getNavItems();

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
              <Link href={item.path} onClick={() => setIsOpen(false)}>
                <span>{item.label}</span>
                <hr />
              </Link>
            </li>
          ))}

          {isAuthenticated && role === "Buyer" && (
            <div className="mobile_menu-icons">
              <div className="mobile_shop_nav flex flex-row gap-2 items-center justify-evenly w-2/5">
                <Link href="/wishlist" onClick={() => setIsOpen(false)}>
                  <div className="liked relative">
                    <FaRegHeart className="nav-icon" />
                    {wishlist.length > 0 && (
                      <span className="absolute wishlist-count">
                        {wishlist.length}
                      </span>
                    )}
                  </div>
                </Link>
                <Link href="/cart" onClick={() => setIsOpen(false)}>
                  <div className="cart relative">
                    <TiShoppingCart className="nav-icon" />
                    {cartState.itemCount > 0 && (
                      <span className="cart-count absolute">
                        {cartState.itemCount}
                      </span>
                    )}
                  </div>
                </Link>
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <div className="user relative">
                    <FiUser className="nav-icon" />
                    <span className="absolute"></span>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {isAuthenticated && (
            <div className="mobile_nav_menu w-full flex flex-col items-center justify-center">
              {getUserMenuItems().map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="link-wrapper"
                  onClick={() => setIsOpen(false)}
                >
                  <div>
                    <item.icon className="wh" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}

              <div className="logout cursor-pointer" onClick={handleLogout}>
                <TbLogout2 className="wh" />
                <span>Logout</span>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mobile_nav_menu w-full flex flex-col items-center justify-center">
              <Link
                href="/signin"
                className="link-wrapper"
                onClick={() => setIsOpen(false)}
              >
                <div>
                  <FiUser className="wh" />
                  <span>Sign In</span>
                </div>
              </Link>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};
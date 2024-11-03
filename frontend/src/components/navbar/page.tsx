"use client";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React, {useState, useEffect} from "react";
import "./navbar.css";
import {FaSearch, FaRegHeart, FaRegUserCircle} from "react-icons/fa";
import {TiShoppingCart} from "react-icons/ti";
import {FiShoppingBag, FiUser, FiBell} from "react-icons/fi";
import {ImCancelCircle} from "react-icons/im";
import {CiStar} from "react-icons/ci";
import {TbLogout2} from "react-icons/tb";
import {HamburgerMenu} from "../hamburger/page";
import {useCart} from "@/context/commerce logic/cartcontext";
import {useWishContext} from "@/context/commerce logic/view-wishcontext";
import {useSearch} from "@/context/searchcontext/searchcontext";
import {useProductContext} from "@/context/productContext/productcontext";
import { Product } from "@/types/product";
import {useUser} from "@/context/userContext/UserContext";
import {hasPermission} from "@/utils/roleUtils";
import axios from "axios";

export const HomeNav = () => {
  const pathname = usePathname();
  const {cartState} = useCart();
  const router = useRouter();
  const {user, logout} = useUser();
  const {isAuthenticated, role} = user;
  const {searchValue, setSearchValue, filteredProducts, setFilteredProducts} =
    useSearch();
  const {fetchProducts} = useProductContext();
  const {wishlist} = useWishContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Define navigation items based on authentication and role
  const getNavItems = () => {
    const baseItems = [
      {label: "Home", path: "/"},
      {label: "Contact", path: "/contact"},
      {label: "About", path: "/about"},
    ];

    if (!isAuthenticated) {
      return [...baseItems, {label: "Sign Up", path: "/signup"}];
    }

    if (role === "buyer") {
      return [
        ...baseItems,
        {label: "My Orders", path: "/orders"},
        {label: "Wishlist", path: "/wishlist"},
      ];
    }

    if (role === "seller") {
      return [
        ...baseItems,
        {label: "My Store", path: "/store"},
        {label: "Products", path: "/products"},
      ];
    }

    return baseItems;
  };

  // Define user menu items based on role
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

    if (user.role === "buyer") {
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

    return baseItems;
  };

  const getProductId = (product: Product) => {
    return product._id || product.id || null;
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setFilteredProducts([]);
    } else {
      try {
        const response = await fetch(
          `/api/search?keyword=${encodeURIComponent(value)}`
        );
        if (response.ok) {
          const data = await response.json();
          // Check if products have either _id or id
          if (data.every((product: Product) => getProductId(product))) {
            setFilteredProducts(data);
          } else {
            console.error("Some products are missing both _id and id");
          }
        } else {
          console.error("Error fetching search results");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleProductClick = (product: Product) => {
    const productId = getProductId(product);
    if (productId) {
      router.push(`/search/${encodeURIComponent(searchValue)}/${productId}`);
      setIsSearchOpen(false);
      setSearchValue("");
      setFilteredProducts([]);
    } else {
      console.error("Product has no valid ID:", product);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch();
  };

  const handleSearchIconClick = () => {
    performSearch();
  };

  const performSearch = () => {
    if (searchValue.trim() !== "") {
      router.push(`/search/${encodeURIComponent(searchValue)}`);
      setIsSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("/auth/logout", null, {
        headers: {Authorization: `Bearer ${token}`},
      });
      localStorage.removeItem("token");
      router.push("/signin");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchValue("");
      setFilteredProducts([]);
    }
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
        <div className="search_icon flex cursor-pointer" onClick={toggleSearch}>
          <div className="search flex flex-row relative items-center justify-evenly">
            <FaSearch className="nav-icon absolute right-1 cursor-pointer" />
          </div>
        </div>
        <HamburgerMenu />
      </div>
      <div className="nav_btn relative w-2/5">
        <ul className="flex flex-row w-full justify-evenly">
          {getNavItems().map((item, index) => (
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
        <div className="search-connd flex flex-col relative w-full items-center justify-center">
          <form
            onSubmit={handleSearchSubmit}
            className="search flex flex-row w-full h-full relative rounded-md items-center justify-evenly"
          >
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full bg-transparent"
              value={searchValue}
              onChange={handleSearch}
            />
            <button type="submit" className="absolute right-1 cursor-pointer">
              <FaSearch className="nav-icon " />
            </button>
          </form>
          {filteredProducts.length > 0 && (
            <div className="search-results absolute top-[60px]  h-[400px] overflow-y-auto bg-[--text] z-50 w-[350px] p-3 shadow-lg  rounded-xl">
              {filteredProducts.map((product) => (
                <div
                  key={getProductId(product)}
                  onClick={() => handleProductClick(product)}
                  className="search-result-item flex flex-col gap-1 text-[--text2] bg-[--text] hover:bg-[--text2] hover:text-[--text] w-full p-3 items-center justify-center rounded-md"
                >
                  <div className="flex flex-row items-center justify-start gap-1 w-full ">
                    <Image
                      src={product.mainImage}
                      width={300}
                      height={500}
                      alt={product.name}
                      className="rounded-lg object-cover w-[120px] h-[100px]"
                    />
                    <span className="font-medium text-[14px]">
                      {product.name}
                    </span>
                  </div>
                  <hr
                    className="h-[1px] w-full border-[1px] border-solid border-[--text1] hover:border-[--text2]
                  rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Show cart and wishlist only for buyers */}
        {isAuthenticated && role === "buyer" && (
          <div className="flex flex-row">
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
          </div>
        )}

        {isAuthenticated ? (
          <div className="user relative online" onClick={toggleMenu}>
            <FaRegUserCircle className="nav-icon" />
            <span className="absolute"></span>
          </div>
        ) : (
          <Link href="/signin">
            <div className="user">
              <FaRegUserCircle className="nav-icon" />
            </div>
          </Link>
        )}
      </div>

      {/* <div
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
        <div onClick={handleLogout} className="logout">
          <TbLogout2 className="wh" />
          <span>Logout</span>
        </div>
      </div> */}

      {/* User Menu Dropdown */}
      {isMenuOpen && isAuthenticated && (
        <div className="navbar_menu absolute flex-col items-center justify-center">
          {getUserMenuItems().map((item, index) => (
            <Link href={item.path} key={index}>
              <div className="menu-item flex items-center gap-2 p-2">
                <item.icon className="wh" />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
          <div
            onClick={handleLogout}
            className="logout flex items-center gap-2 p-2 cursor-pointer"
          >
            <TbLogout2 className="wh" />
            <span>Logout</span>
          </div>
        </div>
      )}

      {/* Search Dropdown */}
      {isSearchOpen && (
        <div className="search-dropdown">
          <div className="search-conn flex flex-row w-full h-full items-center justify-start relative">
            <input
              type="text"
              placeholder="What are you looking for..."
              className="search-input"
              value={searchValue}
              onChange={handleSearch}
            />
            {searchValue && (
              <FaSearch
                className="nav-icon absolute right-3"
                onClick={handleSearchIconClick}
              />
            )}
          </div>
          <ImCancelCircle
            className="cancel-icon"
            onClick={() => setIsSearchOpen(false)}
          />

          {filteredProducts.length > 0 && (
            <div className="mobile-search-results">
              {filteredProducts.map((product) => (
                <div
                  key={getProductId(product)}
                  onClick={() => handleProductClick(product)}
                  className="search-result-item overflow-y-auto text-[--text2] bg-[--text] hover:bg-[--text2] hover:text-[--text] w-full p-3 items-center justify-center"
                >
                  <Image
                    src={product.mainImage}
                    width={100}
                    height={100}
                    alt={product.name}
                    className=""
                  />
                  {product.name}
                  <hr
                    className="h-[1px] w-full border-[1px] border-solid border-[--text1] hover:border-[--text2]
                  rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

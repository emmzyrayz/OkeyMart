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

export const HomeNav = () => {
  const pathname = usePathname();
  const {cartState} = useCart();
  const router = useRouter();
  const {searchValue, setSearchValue, filteredProducts, setFilteredProducts} =
    useSearch();
  const { fetchProducts} = useProductContext();
  const {wishlist} = useWishContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
        const response = await fetch(`/api/search?keyword=${encodeURIComponent(value)}`);
        if (response.ok) {
          const data = await response.json();
          setFilteredProducts(data);
        } else {
          console.error("Error fetching search results");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/search/${searchValue}/${productId}`);
    setIsSearchOpen(false);
    setSearchValue("");
    setFilteredProducts([]);
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
     router.push(`/search/${searchValue}`);
     setIsSearchOpen(false);
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
            <div className="search-results absolute top-[60px] bg-[--text] z-50 w-full p-3">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="search-result-item overflow-y-auto text-[--text2] bg-[--text] hover:bg-[--text2] hover:text-[--text] w-full p-3 items-center justify-center"
                >
                  <Image src={product.mainImage} width={100} height={100} alt={product.name} className="" />
                  {product.name}
                  <hr className="h-[1px] w-full border-[1px] border-solid border-[--text1] hover:border-[--text2]
                  rounded-lg" />
                </div>
              ))}
            </div>
          )}
        </div>
        <Link href="/wishlist">
          <div className="liked relative">
            <FaRegHeart className="nav-icon" />
            {wishlist.length > 0 && (
              <span className="absolute wishlist-count">{wishlist.length}</span>
            )}
          </div>
        </Link>
        <Link href="/cart">
          <div className="cart relative">
            <TiShoppingCart className="nav-icon" />
            {cartState.itemCount > 0 && (
              <span className="cart-count absolute">{cartState.itemCount}</span>
            )}
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
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="search-result-item"
                >
                  {product.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

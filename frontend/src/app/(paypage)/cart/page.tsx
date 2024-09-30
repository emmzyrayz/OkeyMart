"use client";
import React, {useState} from "react";
import "./cart.css";
import Image from "next/image";
import {FaAngleUp, FaAngleDown} from "react-icons/fa";
import {MdCancel} from "react-icons/md";
import Monitor from "../../../assets/img/products/monitor.png";
import RedGampad from "../../../assets/img/products/gamepad.png";

// Example product data, this can come from state or props
const cartItemsData = [
  {
    id: 1,
    name: "LCD Monitor",
    price: 960,
    quantity: 1,
    image: Monitor, // Update with actual image path
  },
  {
    id: 2,
    name: "H1 Gamepad",
    price: 1960,
    quantity: 2,
    image: RedGampad, // Update with actual image path
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(cartItemsData);

  // Function to handle quantity change
  const handleQuantityChange = (id: number, action: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                action === "increment"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const calculateSubtotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  return (
    <div className="cart_section">
      <div className="cart_nav flex flex-row gap-1">
        <span className="faint">Home</span>
        <span className="faint">/</span>
        <span className="full">Cart</span>
      </div>
      <div className="cart_table">
        <div className="cart-container">
          <h1>Your Shopping Cart</h1>

          {/* Table Headers */}
          <div className="cart-header">
            <div className="cart-header-item">Product</div>
            <div className="cart-header-item">Price</div>
            <div className="cart-header-item">Quantity</div>
            <div className="cart-header-item">Subtotal</div>
          </div>

          {/* Product Rows */}
          {cartItems.map((item) => (
            <div className="cart-row" key={item.id}>
              {/* Product Info */}
              <div className="cart-item product-info flex flex-row items-center justify-center">
                <div className="product_image flex items-center justify-center relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                  />
                  <MdCancel className="absolute text-red-500 fa" />
                </div>
                <p>{item.name}</p>
              </div>

              {/* Price */}
              <div className="cart-item price">${item.price}</div>

              {/* Quantity with Up/Down Arrows */}
              <div className="cart-item quantity ">
                <div className="quantity-control flex flex-row items-center justify-center relative w-full h-full">
                  <span className="quantity-value w-1/2 h-full items-center justify-center">
                    {String(item.quantity).padStart(2, "0")}
                  </span>
                  <div className="quantity-btns flex flex-col items-center relative w-1/2 h-full">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, "increment")}
                    >
                      <FaAngleUp />
                    </button>
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, "decrement")}
                    >
                      <FaAngleDown />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtotal */}
              <div className="cart-item subtotal">
                ${calculateSubtotal(item.price, item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cart_btn w-full flex flex-row items-center justify-between">
        <div className="return">Return To Shop</div>
        <div className="update">Update Cart</div>
      </div>
      <div className="cart_checkout flex flex-row items-start justify-between w-full">
        <div className="coupon flex flex-row gap-2">
          <input
            type="text"
            className="coupon_input"
            placeholder="Coupon Code"
          />
          <button className="coupon_btn">Apply Coupon</button>
        </div>
        <div className="cart_total w-full relative">
          {/* Add a total section or checkout button */}
          <div className="cart-footer w-full h-full flex flex-col">
            <h2 className="total_head">Cart Total</h2>
            <div className="total_con gap-4">
              <div className="sub_total flex flex-row justify-between border-bottom-line">
                <p className="sub_total_head">Subtotal:</p>
                <p className="sub_total_price">
                  $
                  {cartItems.reduce(
                    (acc, item) =>
                      acc + calculateSubtotal(item.price, item.quantity),
                    0
                  )}
                </p>
              </div>
              <div className="shipping_total flex flex-row justify-between border-bottom-line">
                <p className="shipping_head">Shipping:</p>
                <span className="shipping_price">Free</span>
              </div>
              <div className="total_t flex flex-row justify-between">
                <p>Total: </p>
                <span>
                  $
                  {cartItems.reduce(
                    (acc, item) =>
                      acc + calculateSubtotal(item.price, item.quantity),
                    0
                  ) + 0 }
                </span>
              </div>
            </div>
            <button className="checkout-btn flex flex-row items-center justify-center">Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

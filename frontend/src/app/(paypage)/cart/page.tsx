"use client";
import React from "react";
import "./cart.css";
import Image from "next/image";
import {FaAngleUp, FaAngleDown} from "react-icons/fa";
import {MdCancel} from "react-icons/md";
import Link from "next/link";
import { CartItem, useCart } from "@/context/commerce logic/cartcontext";

// Example product data, this can come from state or props


export default function Cart() {
  const {cartState, updateQuantity, removeFromCart} = useCart();
  const {items} = cartState;

  // Function to handle quantity change
  const handleQuantityChange = (id: string, action: string) => {
    console.log(`Quantity change: ${action} for item ${id}`);
    const item: CartItem | undefined = items.find((item) => item._id === id);
    if (!item) return;

    const newQuantity =
      action === "increment"
        ? item.quantity + 1
        : Math.max(1, item.quantity - 1);

    updateQuantity(String(id), newQuantity);
  };

  const calculateSubtotal = (
    price: number,
    quantity: number,
    discount: number = 0
  ) => {
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice * quantity;
  };

  return (
    <div className="cart_section flex flex-col gap-2 mt-3">
      <div className="cart_nav flex flex-row gap-1">
        <Link href="/">
          <span className="faint">Home</span>
        </Link>
        <span className="faint">/</span>
        <span className="full">Cart</span>
      </div>
      <div className="cart_table">
        <div className="cart-container">
          {/* Table Headers */}
          <div className="cart-header">
            <div className="cart-header-item">Product</div>
            <div className="cart-header-item">Price</div>
            <div className="cart-header-item">Quantity</div>
            <div className="cart-header-item">Subtotal</div>
          </div>

          {/* Product Rows */}
          {items.map((item: CartItem) => (
            <div className="cart-row" key={item._id}>
              {/* Product Info */}
              <div className="cart-item product-info flex flex-row items-center justify-center">
                <div className="product_image flex items-center justify-center relative">
                  <Image
                    src={item.mainImage}
                    alt={item.name}
                    width={80}
                    height={80}
                  />
                  <MdCancel
                    className="absolute text-red-500 fa"
                    onClick={() => removeFromCart(item._id)}
                  />
                </div>
                <p>{item.name}</p>
              </div>

              {/* Price */}
              <div className="cart-item price">
                ${(item.price * (1 - (item.discount ?? 0) / 100)).toFixed(2)}
              </div>

              {/* Quantity with Up/Down Arrows */}
              <div className="cart-item quantity flex flex-row relative h-full">
                <div className="quantity-control flex flex-row items-center justify-center relative w-full h-full">
                  <span className="quantity-value w-1/2 h-full items-center justify-center">
                    {String(item.quantity).padStart(2, "0")}
                  </span>
                  <div className="quantity-btns flex flex-col items-center relative w-1/2 h-full">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleQuantityChange(item._id, "increment")
                      }
                    >
                      <FaAngleUp />
                    </button>
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleQuantityChange(item._id, "decrement")
                      }
                    >
                      <FaAngleDown />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtotal */}
              <div className="cart-item subtotal">
                $
                {calculateSubtotal(
                  item.price,
                  item.quantity,
                  item.discount
                ).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cart_btn w-full flex flex-row items-center justify-between">
        <div className="return">Return To Shop</div>
        <div className="update">Update Cart</div>
      </div>
      <div className="cart_checkout flex flex-row items-start justify-between w-full gap-5">
        <div className="coupon flex flex-row gap-2 w-3/5">
          <input
            type="text"
            className="coupon_input"
            placeholder="Coupon Code"
          />
          <button className="coupon_btn">Apply Coupon</button>
        </div>
        <div className="cart_total w-2/5 relative mb-6">
          {/* Add a total section or checkout button */}
          <div className="cart-footer w-full h-full flex flex-col justify-center">
            <h2 className="total_head">Cart Total</h2>
            <div className="total_con gap-4">
              <div className="sub_total flex flex-row justify-between border-bottom-line">
                <p className="sub_total_head">Subtotal:</p>
                <p className="sub_total_price">
                  $
                  {items
                    .reduce(
                      (acc, item) =>
                        acc + calculateSubtotal(item.price, item.quantity),
                      0
                    )
                    .toFixed(2)}
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
                  {items
                    .reduce(
                      (acc, item) =>
                        acc + calculateSubtotal(item.price, item.quantity),
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
            >
              <button className="checkout-btn flex flex-row items-center justify-center">
                <span>Proceed to Checkout</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

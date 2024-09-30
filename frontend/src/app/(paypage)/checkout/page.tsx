"use client";
import React, {useState} from "react";
import Image from "next/image";
import "./checkout.css";
import Monitor from "../../../assets/img/products/monitor.png";
import RedGampad from "../../../assets/img/products/gamepad.png";
import Bkash from "../../../assets/img/banks/Bkash.png";
import Visa from "../../../assets/img/banks/visa.png";
import Mastercard from '../../../assets/img/banks/mastercard.png';
import Nagad from "../../../assets/img/banks/Nagad.png";
import { MdCancel } from "react-icons/md";

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

export default function Checkout() {
  // const [cartItems, setCartItems] = useState(cartItemsData);
  const [selectedPayment, setSelectedPayment] = useState<string>("cash");
  const cartItems = cartItemsData;

  // Function to handle quantity change
  // const handleQuantityChange = (id: number, action: string) => {
  //   setCartItems((prevItems) =>
  //     prevItems.map((item) =>
  //       item.id === id
  //         ? {
  //             ...item,
  //             quantity:
  //               action === "increment"
  //                 ? item.quantity + 1
  //                 : Math.max(1, item.quantity - 1),
  //           }
  //         : item
  //     )
  //   );
  // };

  const calculateSubtotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  return (
    <div className="checkout_section">
      <div className="checkout_nav flex flex-row gap-1 mb-10">
        <span className="faint">Account</span>
        <span className="faint">/</span>
        <span className="faint">My Account</span>
        <span className="faint">/</span>
        <span className="faint">Product</span>
        <span className="faint">/</span>
        <span className="faint">View Cart</span>
        <span className="faint">/</span>
        <span className="full">CheckOut</span>
      </div>
      <div className="checkout_container flex flex-col gap-5">
        <div className="checkout_head mb-10">Billing Details</div>
        <div className="checkout_con flex flex-row items-center justify-between h-full gap-5">
          <div className="checkout_inputs flex flex-col items-start justify-center gap-5 w-2/4">
            <div className="checkout_input">
              <span>First Name*</span>
              <input type="text" className="input" />
            </div>
            <div className="checkout_input">
              <span>Company Name*</span>
              <input type="text" className="input" />
            </div>
            <div className="checkout_input">
              <span>Street Address*</span>
              <input type="text" className="input" />
            </div>
            <div className="checkout_input">
              <span>Apartment, floor, etc. (optional)</span>
              <input type="text" className="input" />
            </div>
            <div className="checkout_input">
              <span>Town/City*</span>
              <input type="text" className="input" />
            </div>
            <div className="checkout_input">
              <span>Phone Number*</span>
              <input type="number" className="input" />
            </div>
            <div className="checkout_input">
              <span>Email Address*</span>
              <input type="email" className="input" />
            </div>
            <div className="checkout_inputt gap-3 flex flex-row">
              <input
                type="checkbox"
                className="tick-checkbox"
                name="tick"
                id="checkbox"
              />
              <span className="full">
                Save this information for faster check-out next time
              </span>
            </div>
          </div>
          <div className="checkout_c flex flex-col gap-5 w-2/4">
            <div className="checkout_items">
              <div className="checkout_item">
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
                    <div className="cart-item price items-center justify-center flex">
                      ${item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                  ) + 0}
                </span>
              </div>
            </div>
            <div className="payment_opt flex flex-col gap-1">
              <div className="bank_opt flex flex-row justify-between">
                <div className="bank_input flex flex-row gap-1 items-center justify-center">
                  <input
                    type="radio"
                    name="payment"
                    id="dot"
                    value="bank"
                    checked={selectedPayment === "bank"}
                    onChange={() => setSelectedPayment("bank")}
                  />
                  <span>Bank</span>
                </div>
                <div className="bank_icons flex flex-row items-center justify-end">
                  <Image src={Bkash} alt="Bkash" width={42} height={28} />
                  <Image src={Visa} alt="Visa" width={42} height={28} />
                  <Image
                    src={Mastercard}
                    alt="Mastercard"
                    width={42}
                    height={28}
                  />
                  <Image src={Nagad} alt="Nagad" width={42} height={28} />
                </div>
              </div>
              <div className="cash_opt flex flex-row gap-1 items-center justify-start">
                <input
                  type="radio"
                  name="payment"
                  id="dot"
                  value="cash"
                  checked={selectedPayment === "cash"}
                  onChange={() => setSelectedPayment("cash")}
                />
                <span>Cash on delivery</span>
              </div>
            </div>
            <div className="coupon flex flex-row gap-2">
              <input
                type="text"
                className="coupon_input"
                placeholder="Coupon Code"
              />
              <button className="coupon_btn">Apply Coupon</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

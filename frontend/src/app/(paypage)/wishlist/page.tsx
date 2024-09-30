import "./wish.css";
import Image from "next/image";
import {FaStar,
  //  FaRegStar, 
  //  FaStarHalf
  } from "react-icons/fa6";
import {RiDeleteBinLine} from "react-icons/ri";
import {CiShoppingCart} from "react-icons/ci";
import GucciBag from "../../../assets/img/products/gucci-bag.png";
import CoolFan from "../../../assets/img/products/cooling-fan.png";
import Gamepad from "../../../assets/img/products/gamepad1.png";
import Jacket from "../../../assets/img/products/jacket.png";
import Laptop from "../../../assets/img/products/laptop.png";
import Monitor from "../../../assets/img/products/monitor.png";
import RedGampad from "../../../assets/img/products/gamepad.png";
import Keyboard from "../../../assets/img/products/keyboard.png";

export default function WishList() {
  return (
    <div className="wishlist_section flex flex-col items-center w-full h-full">
      <div className="wishlist_container flex flex-col items-start justify-center gap-5 w-full">
        <div className="wish_head flex flex-row w-full items-center justify-between">
          <h2>Wishlist (4)</h2>
          <div className="btn_w flex items-center justify-center">
            Move All To Bag
          </div>
        </div>
        <div className="wish_items flex flex-row overflow-x-auto gap-5">
          <div className="wish_item flex flex-col gap-3">
            <div className="item_img flex flex-col relative">
              <Image
                src={GucciBag}
                alt="Gucci Bag"
                width={100}
                className="Image"
                height={300}
              />
              <div className="discount absolute">-35%</div>
              <span className="bbin">
                <RiDeleteBinLine className="bin" />
              </span>
              <span className="ccart flex flex-row items-center justify-center gap-2 absolute">
                <CiShoppingCart className="cart" /> <span>Add To Cart</span>
              </span>
            </div>
            <div className="item_desc flex flex-col items-start justify-center">
              <h3>Gucci duffle Bag</h3>
              <div className="price flex flex-row gap-2">
                <span className="disc_price">$960</span>
                <span className="act_price">$1160</span>
              </div>
            </div>
          </div>

          <div className="wish_item flex flex-col gap-3">
            <div className="item_img flex flex-col relative">
              <Image
                src={CoolFan}
                alt="Cooling Fan"
                width={100}
                className="Image"
                height={300}
              />
              <div className="discount absolute hidden">-35%</div>
              <span className="bbin">
                <RiDeleteBinLine className="bin" />
              </span>
              <span className="ccart flex flex-row items-center justify-center gap-2 absolute">
                <CiShoppingCart className="cart" /> <span>Add To Cart</span>
              </span>
            </div>
            <div className="item_desc flex flex-col items-start justify-center">
              <h3>RGB liquid CPU Cooler</h3>
              <div className="price flex flex-row gap-2">
                <span className="disc_price">$1960</span>
                <span className="act_price hidden">$1160</span>
              </div>
            </div>
          </div>

          <div className="wish_item flex flex-col gap-3">
            <div className="item_img flex flex-col relative">
              <Image
                src={Gamepad}
                alt="XBox Gamepad"
                width={100}
                className="Image"
                height={300}
              />
              <div className="discount absolute hidden">-35%</div>
              <span className="bbin">
                <RiDeleteBinLine className="bin" />
              </span>
              <span className="ccart flex flex-row items-center justify-center gap-2 absolute">
                <CiShoppingCart className="cart" /> <span>Add To Cart</span>
              </span>
            </div>
            <div className="item_desc flex flex-col items-start justify-center">
              <h3>GP11 Shooter USB Gamepad</h3>
              <div className="price flex flex-row gap-2">
                <span className="disc_price">$550</span>
                <span className="act_price hidden">$1160</span>
              </div>
            </div>
          </div>

          <div className="wish_item flex flex-col gap-3">
            <div className="item_img flex flex-col relative">
              <Image
                src={Jacket}
                alt="Quilted Satin Jacket"
                width={100}
                className="Image"
                height={300}
              />
              <div className="discount absolute hidden">-35%</div>
              <span className="bbin">
                <RiDeleteBinLine className="bin" />
              </span>
              <span className="ccart flex flex-row items-center justify-center gap-2 absolute">
                <CiShoppingCart className="cart" /> <span>Add To Cart</span>
              </span>
            </div>
            <div className="item_desc flex flex-col items-start justify-center">
              <h3>Quilted Satin Jacket</h3>
              <div className="price flex flex-row gap-2">
                <span className="disc_price">$750</span>
                <span className="act_price hidden">$1160</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wishlist_foryou flex flex-col items-start justify-center gap-5 w-full">
        <div className="wish_head flex flex-row w-full items-center justify-between">
          <div className="today_top flex flex-row items-center gap-3">
            <div className="today_red"></div>
            <h2 className="h2">Today&apos;s</h2>
          </div>
          <div className="btn_w flex items-center justify-center">See All</div>
        </div>
        <div className="wish_items flex flex-row overflow-x-auto gap-5">
          <div className="wish_item flex flex-col gap-3">
            <div className="item_img flex flex-col relative">
              <Image
                src={Laptop}
                alt="ASUS FHD Gaming Laptop"
                width={100}
                className="Image"
                height={300}
              />
              <div className="discount absolute">-35%</div>
              <span className="bbin">
                <RiDeleteBinLine className="bin" />
              </span>
              <span className="ccart flex flex-row items-center justify-center gap-2 absolute">
                <CiShoppingCart className="cart" /> <span>Add To Cart</span>
              </span>
            </div>
            <div className="item_desc flex flex-col items-start justify-center">
              <h3>ASUS FHD Gaming Laptop</h3>
              <div className="price flex flex-row gap-2">
                <span className="disc_price">$960</span>
                <span className="act_price">$1160</span>
              </div>
              <div className="rating">
                <div className="rating_icon flex flex-row items-center">
                  <FaStar className="fa-star" />
                  <FaStar className="fa-star" />
                  <FaStar className="fa-star" />
                  <FaStar className="fa-star" />
                  <FaStar className="fa-star" />
                  {/* <div className="half-star-container">
                    <FaStarHalf className="fa-star" />
                    <FaRegStar className="half-fill" />
                  </div>
                  <FaRegStar className="fa-star" /> */}
                </div>
                <div className="rating_number">(99)</div>
              </div>
            </div>
          </div>

          <div className="wish_item flex flex-col gap-3">
            <div className="item_img flex flex-col relative">
              <Image
                src={Monitor}
                alt="IPS LCD Gaming Monitor"
                width={100}
                className="Image"
                height={300}
              />
              <div className="discount absolute hidden">-35%</div>
              <span className="bbin">
                <RiDeleteBinLine className="bin" />
              </span>
              <span className="ccart flex flex-row items-center justify-center gap-2 absolute">
                <CiShoppingCart className="cart" /> <span>Add To Cart</span>
              </span>
            </div>
            <div className="item_desc flex flex-col items-start justify-center">
              <h3>IPS LCD Gaming Monitor</h3>
              <div className="price flex flex-row gap-2">
                <span className="disc_price">$1160</span>
                <span className="act_price hidden">$1160</span>
              </div>
              <div className="rating">
                <div className="rating_icon flex flex-row items-center">
                  <FaStar className="fa-star" />
                  <FaStar className="fa-star" />
                  <FaStar className="fa-star" />
                  <FaStar className="fa-star" />
                  <FaStar className="fa-star" />
                  {/* <div className="half-star-container">
                    <FaStarHalf className="fa-star" />
                    <FaRegStar className="half-fill" />
                  </div>
                  <FaRegStar className="fa-star" /> */}
                </div>
                <div className="rating_number">(99)</div>
              </div>
            </div>
          </div>

          <div className="wish_item flex flex-col gap-3">
            <div className="item_img flex flex-col relative">
              <Image
                src={RedGampad}
                alt="HAVIT HV-G92 Gamepad"
                width={100}
                className="Image"
                height={300}
              />
              <div className="discount absolute hidden">-35%</div>
              <span className="bbin">
                <RiDeleteBinLine className="bin" />
              </span>
              <span className="ccart flex flex-row items-center justify-center gap-2 absolute">
                <CiShoppingCart className="cart" /> <span>Add To Cart</span>
              </span>
            </div>
            <div className="item_desc flex flex-col items-start justify-center">
              <h3>HAVIT HV-G92 Gamepad</h3>
              <div className="price flex flex-row gap-2">
                <span className="disc_price">$550</span>
                <span className="act_price hidden">$1160</span>
              </div>
            </div>
          </div>

          <div className="wish_item flex flex-col gap-3">
            <div className="item_img flex flex-col relative">
              <Image
                src={Keyboard}
                alt="AK-900 Wired Keyboard"
                width={100}
                className="Image"
                height={300}
              />
              <div className="discount absolute hidden">-35%</div>
              <span className="bbin">
                <RiDeleteBinLine className="bin" />
              </span>
              <span className="ccart flex flex-row items-center justify-center gap-2 absolute">
                <CiShoppingCart className="cart" /> <span>Add To Cart</span>
              </span>
            </div>
            <div className="item_desc flex flex-col items-start justify-center">
              <h3>AK-900 Wired Keyboard</h3>
              <div className="price flex flex-row gap-2">
                <span className="disc_price">$750</span>
                <span className="act_price hidden">$1160</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import Image from 'next/image';
// import Link from 'next/link';
import './product.css';
import { FaPlus, FaMinus, FaRegHeart,
  //  FaHeart,
    FaStarHalf, FaRegStar, FaStar, FaRegEye } from 'react-icons/fa6';
import {TbTruckDelivery} from "react-icons/tb";
import {PiArrowsCounterClockwise} from "react-icons/pi";
import Havic1 from '../../assets/img/products/havic-gamepad/havic-1.png';
import Havic2 from '../../assets/img/products/havic-gamepad/havic-2.png';
import Havic3 from '../../assets/img/products/havic-gamepad/havic-3.png';
import Havic4 from '../../assets/img/products/havic-gamepad/havic-4.png';
import Havic5 from '../../assets/img/products/havic-gamepad/havic-5.png';

import Redgamepad from '../../assets/img/products/gamepad.png';
import Keyboard from '../../assets/img/products/keyboard.png';
import Monitor from "../../assets/img/products/monitor.png";
import Cooler from '../../assets/img/products/cooling-fan.png';

export const ProductInfo = () => {
    return (
      <div className="product-info_section">
        <div className="productinfo_top">
          <div className="profile_nav flex flex-row gap-1 items-start justify-start">
            <span className="faint">Home</span>
            <span className="faint">/</span>
            <span className="faint">Gaming</span>
            <span className="faint">/</span>
            <span className="full">Havic HV G-92 Gamepad</span>
          </div>
        </div>
        <div className="product-info_container flex flex-row items-center justify-center gap-5">
          <div className="product-info_image flex flex-row w-2/3">
            <div className="image_items flex flex-col items-center justify-center w-1/3 gap-3">
              <div className="image_item">
                <Image src={Havic2} alt="" width={100} height={100} />
              </div>
              <div className="image_item">
                <Image src={Havic3} alt="" width={100} height={100} />
              </div>
              <div className="image_item">
                <Image src={Havic4} alt="" width={100} height={100} />
              </div>
              <div className="image_item">
                <Image src={Havic5} alt="" width={100} height={100} />
              </div>
            </div>
            <div className="product_disp flex items-center justify-center w-2/3 ">
              <Image
                src={Havic1}
                alt=""
                width={500}
                height={300}
                className="display_image"
              />
            </div>
          </div>
          <div className="product-info_det flex flex-col items-center justify-start w-1/3 gap-1">
            <div className="det_top flex flex-col items-start justify-center">
              <h1 className="det_name">Havic HV G-92 Gamepad</h1>
              <span className="det_rating-con flex flex-row items-center justify-center gap-1">
                <span className="det_rating flex flex-row items-center justify-center gap-1">
                  <div className="rating_icon flex flex-row items-center">
                    <FaStar className="fa-star" />
                    <FaStar className="fa-star" />
                    <FaStar className="fa-star" />
                    <div className="half-star-container">
                      <FaStarHalf className="fa-star" />
                      <FaRegStar className="half-fill" />
                    </div>
                    <FaRegStar className="fa-star" />
                  </div>
                  <p>(150 Reviews)</p>
                </span>
                <p>|</p>
                <span className="det_stock">In Stock</span>
              </span>
              <span className="det_price">$192.00</span>
              <div className="det_sum">
                PlayStation 5 Controller Skin High quality vinyl with air
                channel adhesive for easy bubble free install & mess free
                removal Pressure sensitive.
              </div>
            </div>
            <hr />
            <div className="det_bottom flex flex-col items-start justify-center">
              <div className="det_color flex flex-row items-center justify-center">
                <span className="colo-name">Colours:</span>
                <div className="colors flex flex-row items-center justify-center">
                  <div className="color purple active"></div>
                  <div className="color orange"></div>
                  <div className="color green"></div>
                  <div className="color cream"></div>
                </div>
              </div>
              <div className="det_sizes flex flex-row items-center justify-center">
                <span className="size-name">Size:</span>
                <div className="sizes flex flex-row">
                  <div className="size">XS</div>
                  <div className="size">S</div>
                  <div className="size active">M</div>
                  <div className="size">L</div>
                  <div className="size">XL</div>
                </div>
              </div>
              <div className="det_calc flex flex-row items-center justify-center gap-2">
                <div className="det_quantity flex flex-row items-center justify-between">
                  <div className="quant_icons border-right">
                    <FaMinus className="quant_icon" />
                  </div>
                  <span className="quant_digit">2</span>
                  <div className="quant_icons border-left">
                    <FaPlus className="quant_icon" />
                  </div>
                </div>
                <div className="det_btn flex flex-row">
                  <span>Buy Now</span>
                </div>
                <div className="det_fav flex flex-row">
                  <FaRegHeart className="quant_icon" />
                </div>
              </div>
              <div className="det_bonus flex flex-col">
                <div className="det_deliver flex flex-row items-center justify-start gap-2">
                  <div className="deliv_icon">
                    <TbTruckDelivery className="quant_icon" />
                  </div>
                  <div className="text">
                    <h2>Free Delivery</h2>
                    <p>Enter your postal code for delievry availability</p>
                  </div>
                </div>
                <div className="det_return flex flex-row items-center justify-start gap-2">
                  <div className="deliv_icon">
                    <PiArrowsCounterClockwise className="quant_icon" />
                  </div>
                  <div className="text">
                    <h2>Return Delievry</h2>
                    <p>
                      Free 30 days delivery returns. <span>Details</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="related_product">
          <div className="related_top flex flex-row items-center gap-2">
            <div className="today_red"></div>
            <h2>Related Item</h2>
          </div>
          <div className="related_items flex flex-row overflow-x-auto mb-8">
            <div className="related_item">
              <div className="product_image">
                <span className="discount">-40%</span>
                <Image
                  alt="product 1"
                  width={200}
                  height={300}
                  src={Redgamepad}
                />
                <div className="product_icons">
                  <div className="icon-heart">
                    <FaRegHeart className="fa" />
                  </div>
                  <div className="icon-eye">
                    <FaRegEye className="fa" />
                  </div>
                </div>
                <div className="product_btn">
                  <span>Add To Cart</span>
                </div>
              </div>
              <div className="product_detail">
                <div className="product_name">HAVIT HV-G92 Gampad</div>
                <div className="product_price">
                  <div className="dscount_price">$120</div>
                  <div className="actual_price">$160</div>
                </div>
                <div className="rating">
                  <div className="rating_icon flex flex-row items-center">
                    <FaStar className="fa-star" />
                    <FaStar className="fa-star" />
                    <FaStar className="fa-star" />
                    <div className="half-star-container">
                      <FaStarHalf className="fa-star" />
                      <FaRegStar className="half-fill" />
                    </div>
                    <FaRegStar className="fa-star" />
                  </div>
                  <div className="rating_number">(88)</div>
                </div>
              </div>
            </div>

            <div className="related_item">
              <div className="product_image">
                <span className="discount">-40%</span>
                <Image
                  alt="product 1"
                  width={200}
                  height={300}
                  src={Keyboard}
                />
                <div className="product_icons">
                  <div className="icon-heart">
                    <FaRegHeart className="fa" />
                  </div>
                  <div className="icon-eye">
                    <FaRegEye className="fa" />
                  </div>
                </div>
                <div className="product_btn">
                  <span>Add To Cart</span>
                </div>
              </div>
              <div className="product_detail">
                <div className="product_name">AK-900 Wired Keyboard</div>
                <div className="product_price">
                  <div className="dscount_price">$960</div>
                  <div className="actual_price">$1160</div>
                </div>
                <div className="rating">
                  <div className="rating_icon flex flex-row items-center">
                    <FaStar className="fa-star" />
                    <FaStar className="fa-star" />
                    <FaStar className="fa-star" />
                    <div className="half-star-container">
                      <FaStarHalf className="fa-star" />
                      <FaRegStar className="half-fill" />
                    </div>
                    <FaRegStar className="fa-star" />
                  </div>
                  <div className="rating_number">(88)</div>
                </div>
              </div>
            </div>

            <div className="related_item">
              <div className="product_image">
                <span className="discount">-40%</span>
                <Image alt="product 1" width={200} height={300} src={Monitor} />
                <div className="product_icons">
                  <div className="icon-heart">
                    <FaRegHeart className="fa" />
                  </div>
                  <div className="icon-eye">
                    <FaRegEye className="fa" />
                  </div>
                </div>
                <div className="product_btn">
                  <span>Add To Cart</span>
                </div>
              </div>
              <div className="product_detail">
                <div className="product_name">IPS LCD Gaming Monitor</div>
                <div className="product_price">
                  <div className="dscount_price">$370</div>
                  <div className="actual_price">$400</div>
                </div>
                <div className="rating">
                  <div className="rating_icon flex flex-row items-center">
                    <FaStar className="fa-star" />
                    <FaStar className="fa-star" />
                    <FaStar className="fa-star" />
                    <div className="half-star-container">
                      <FaStarHalf className="fa-star" />
                      <FaRegStar className="half-fill" />
                    </div>
                    <FaRegStar className="fa-star" />
                  </div>
                  <div className="rating_number">(88)</div>
                </div>
              </div>
            </div>

            <div className="related_item">
              <div className="product_image">
                <span className="discount">-40%</span>
                <Image alt="product 1" width={200} height={300} src={Cooler} />
                <div className="product_icons">
                  <div className="icon-heart">
                    <FaRegHeart className="fa" />
                  </div>
                  <div className="icon-eye">
                    <FaRegEye className="fa" />
                  </div>
                </div>
                <div className="product_btn">
                  <span>Add To Cart</span>
                </div>
              </div>
              <div className="product_detail">
                <div className="product_name">RGB liquid CPU Cooler</div>
                <div className="product_price">
                  <div className="dscount_price">$120</div>
                  <div className="actual_price">$160</div>
                </div>
                <div className="rating">
                  <div className="rating_icon flex flex-row items-center">
                    <FaStar className="fa-star" />
                    <FaStar className="fa-star" />
                    <FaStar className="fa-star" />
                    <div className="half-star-container">
                      <FaStarHalf className="fa-star" />
                      <FaRegStar className="half-fill" />
                    </div>
                    <FaRegStar className="fa-star" />
                  </div>
                  <div className="rating_number">(88)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
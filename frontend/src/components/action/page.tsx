import './action.css';
import { BiHeadphone } from 'react-icons/bi';
import {AiOutlineTruck} from "react-icons/ai";
import {HiOutlineShieldCheck} from "react-icons/hi";


export default function Action() {
    return (
      <div className="action_section flex flex-row flex-wrap w-full items-center justify-center gap-4">
        <div className="action_1">
          <div className="top">
            <div className="shade-1">
              <div className="shade-2">
                <AiOutlineTruck className="action_icon" />
              </div>
            </div>
          </div>
          <div className="middle">
            <span>FREE AND FAST DELIVERY</span>
          </div>
          <div className="bottom">
            <span>Free delivery for all orders over $140</span>
          </div>
        </div>
        <div className="action_2">
          <div className="top">
            <div className="shade-1">
              <div className="shade-2">
                <BiHeadphone className="action_icon" />
              </div>
            </div>
          </div>
          <div className="middle">
            <span>24/7 CUSTOMER SERVICE</span>
          </div>
          <div className="bottom">Freindly 24/7 customer support</div>
        </div>
        <div className="action_3">
          <div className="top">
            <div className="shade-1">
              <div className="shade-2">
                <HiOutlineShieldCheck className="action_icon" />
              </div>
            </div>
          </div>
          <div className="middle">
            <span>MONEY BACK GUARANTEE</span>
          </div>
          <div className="bottom">
            <span>We return money within 30 days</span>
          </div>
        </div>
      </div>
    );
}
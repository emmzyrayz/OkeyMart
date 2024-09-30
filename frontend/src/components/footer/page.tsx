import './footer.css';
import Image from 'next/image';
import {FaCopyright, FaRegPaperPlane} from "react-icons/fa";
import QrCode from '../../assets/img/products/Qrcode.png';
import Playstore from "../../assets/img/products/g-playstore.png";
import Appstore from "../../assets/img/products/appstore.png";


export default function Footer() {
    return (
      <footer className="footer">
        <div className="footer_section flex flex-col items-center justify-center gap-2 relative w-full">
          <div className="footer_container flex flex-row items-center h-full w-full gap-5 justify-evenly">
            <div className="exclusive h-full">
              <h2 className="title">Exclusive</h2>
              <div className="text">Subscribe</div>
              <span>Get 10% off your first order</span>
              <div className="input flex flex-row gap-2 items-center relative">
                <input type="text" placeholder="Enter your email" />
                <FaRegPaperPlane className="fa" size={30} />
              </div>
            </div>
            <div className="support h-full">
              <h2 className="title">Support</h2>
              <div className="text">
                111 Bijoy sarani, Dhaka, <br /> DH1515, Bangladesh
              </div>
              <span>exclusive@gmail.com</span>
              <span>+88015-88888-9999</span>
            </div>
            <div className="account">
              <h2 className="title">Account</h2>
              <span>My Account</span>
              <span>Login/Register</span>
              <span>Cart</span>
              <span>Wishlist</span>
              <span>Shop</span>
            </div>
            <div className="quick-link">
              <h2 className="title">Quick Link</h2>
              <span>Privacy Policy</span>
              <span>Terms Of Use</span>
              <span>FAQ</span>
              <span>Contact</span>
            </div>
            <div className="app">
              <h2 className="title">Download App</h2>
              <span>Save $3 with App (for New User Only)</span>
              <div className="app-con flex flex-row gap-2 items-center">
                <div className="qr">
                  <Image src={QrCode} width={500} height={300} alt="QR Code" />
                </div>
                <div className="appst">
                  <div className="playstore">
                    <Image
                      src={Playstore}
                      width={150}
                      height={150}
                      alt="Playstore"
                    />
                  </div>
                  <div className="appstore">
                    <Image
                      src={Appstore}
                      width={150}
                      height={150}
                      alt="Appstore"
                    />
                  </div>
                </div>
              </div>
              <div className="social-con"></div>
            </div>
          </div>
          <div className="copyright absolute bottom-2">
            <span className="flex flex-row text-primary gap-2 items-center">
              <FaCopyright />
              {/*  */}
              Copyright PANDA 2024. All right reserved
            </span>
          </div>
        </div>
      </footer>
    );
}
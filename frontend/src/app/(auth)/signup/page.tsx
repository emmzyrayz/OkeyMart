import './register.css';
import Image from 'next/image';
import Link from 'next/link';
import SignImg from '../../../assets/img/products/signin-img.png';
import Gicon from '../../../assets/img/products/Icon-Google.svg'
export default function SignUp() {
    return (
      <div className="signup_section flex flex-row w-full h-full items-center justify-center">
        <div className="signup_img w-3/5">
          <Image
            src={SignImg}
            className="sign-logo"
            width={500}
            height={300}
            alt="Sign Up Logo"
          />
        </div>
        <div className="signup_container w-2/5 flex flex-col items-start justify-center">
          <div className="sign_head">
            <span>Create an Account</span>
          </div>
          <div className="sign_desc">
            <span>Enter your details below</span>
          </div>
          <form
            action="POST"
            className="flex flex-col relative items-center sign-form"
          >
            <input
              type="text"
              className="name"
              placeholder="Your Name"
              required
            />
            <input
              type="email"
              className="email"
              placeholder="Your Email"
              required
            />
            <input
              type="password"
              className="password"
              placeholder="Your Password"
              required
            />
            <input type="button" className="sign-btn" value="Create Account" />
            <div className="google flex flex-row gap-2 items-center justify-center">
              {/* <Image
                src={Gicon}
                alt="google icon"
                className="g-icon"
                width={24}
                height={24}
              /> */}
              <Gicon className="g-icon" />
              <input
                type="button"
                value="Sign Up with Google"
                className="google-signup-btn"
              />
            </div>
          </form>
          <div className="sign-re flex justify-center items-end">
            <span>
              Already have an account?{" "}
              <Link href="/signin" className="link">
                Log in
              </Link>
            </span>
          </div>
        </div>
      </div>
    );
}
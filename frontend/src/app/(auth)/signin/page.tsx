import './login.css'
import Image from "next/image";
import Link from "next/link";
import SignImg from "../../../assets/img/products/signin-img.png";
export default function SignIn() {
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
      <div className="signup_container w-2/5 gap-2 flex flex-col items-start justify-center">
        <div className="sign_head">
          <span>Sign In</span>
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
            placeholder="Email or Phone Number"
            required
          />
          <input
            type="password"
            className="password"
            placeholder="Password"
            required
          />
          <div className="btns flex flex-row items-center justify-between">
            <input type="button" className="sign-btn" value="Sign In" />
            <Link href='/forgotten_password'>
              <input
                type="button"
                className="forgot-btn"
                value="Forget Password?"
              />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

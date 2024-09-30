'use client'
import {useState, useEffect} from "react";
import "./forgot-password.css";
import Image from "next/image";
import SignImg from "../../../assets/img/products/signin-img.png";
export default function ForgotPassword() {
    const [timer, setTimer] = useState(50); // 50 seconds timer

    useEffect(() => {
      if (timer > 0) {
        const countdown = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        return () => clearInterval(countdown);
      }
    }, [timer]);


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
          <span>Forgot Password?</span>
        </div>
        <div className="sign_desc">
          <span>Enter your Email below</span>
        </div>
        <form
          action="POST"
          className="flex flex-col relative items-center sign-form"
        >
          <input
            type="text"
            name="email_or_phone"
            className="name"
            placeholder="Email or Phone Number"
            autoComplete="off"
            required
          />

          <div className="password-container relative w-full">
            <input
              type="password"
              className="password"
              name="code"
              placeholder="Enter Code"
              autoComplete="new-password"
              required
            />
            <span className="timer absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">
              {timer}s
            </span>
          </div>

          <div className="btns flex flex-row items-center justify-between">
            <input type="button" className="sign-btn" value="Send Code" />
          </div>
        </form>

        <form
          action="POST"
          className="flex flex-col hidden relative items-center sign-form"
        >
          <input
            type="text"
            name="email_or_phone"
            className="name"
            placeholder="Enter new Password"
            autoComplete="off"
            required
          />

          <div className="password-container relative w-full">
            <input
              type="password"
              className="password"
              name="code"
              placeholder="Confirm Password"
              autoComplete="new-password"
              required
            />
            <span className="timer absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">
              {timer}s
            </span>
          </div>

          <div className="btns flex flex-row items-center justify-between">
            <input type="button" className="sign-btn" value="Confirm" />
          </div>
        </form>
      </div>
    </div>
  );
}

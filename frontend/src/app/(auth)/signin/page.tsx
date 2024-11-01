"use client";

import React, { useState, ChangeEvent, FormEvent} from "react";
import {useRouter} from "next/navigation";
import authApi, {setAuthToken} from "@/utils/authApi";
import {GridLoad} from "@/components/fetchloading/btnloading";
import "./login.css";
import Image from "next/image";
import Link from "next/link";
import SignImg from "../../../assets/img/products/signin-img.png";
import { FaEyeSlash, FaEye } from "react-icons/fa6";

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({email: "", password: ""});
  const [error, setError] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authApi.post("/api/auth/login", formData);
      const {token, user} = res.data;

      localStorage.setItem("token", token);
      setAuthToken(token);
      router.push("/"); // Redirect to home page after successful login
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(
          err.response?.data?.message || "Error signing in. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="signup_section flex flex-row w-full h-full items-center justify-center">
      <div className="signup_img w-[50%] h-fit">
        <Image
          src={SignImg}
          className="sign-logo flex items-center justify-center"
          width={500}
          height={300}
          alt="Sign Up Logo"
        />
      </div>
      <div className="signup_container w-[40%] gap-2 flex flex-col items-start justify-center">
        <div className="sign_head">
          <span>Sign In</span>
        </div>
        <div className="sign_desc">
          <span>Enter your details below</span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col relative items-center sign-form"
        >
          <input
            type="text"
            name="email"
            className="name w-full"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email or Phone Number"
            disabled={isLoading}
            required
          />
          <div className="password-input relative">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="password"
              placeholder="Password"
              disabled={isLoading}
              required
            />
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            type="submit"
            className="sign-btn w-full hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? <GridLoad /> : "Sign In"}
          </button>
        </form>

        {error && (
          <div className="error-message text-red-500 mb-4 w-full text-center">
            {error}
          </div>
        )}

        <div className="forg flex w-[371px] flex-row items-center justify-end p-2 text-[--secondary2] hover:text-[--btn-hover]">
          <Link href="/forgotten_password">
            <input
              type="button"
              className="forgot-btn cursor-pointer"
              value="Forget Password?"
            />
          </Link>
        </div>

        <div className="sign-re flex justify-center items-end">
          <span>
            Don't have an account?{" "}
            <Link href="/signup" className="link">
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

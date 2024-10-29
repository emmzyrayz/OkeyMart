"use client";

import React, {useEffect, useState, ChangeEvent, FormEvent} from "react";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import authApi, {setAuthToken} from "@/utils/authApi";

import "./login.css";
import Image from "next/image";
import Link from "next/link";
import SignImg from "../../../assets/img/products/signin-img.png";
import Gicon from "../../../assets/img/products/Icon-Google.svg";
import { FaGithub } from "react-icons/fa6";

export default function SignIn() {
  // const {data: session} = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({email: "", password: ""});
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.post("/api/auth/login", formData);
      const {token} = res.data;

      localStorage.setItem("token", token);
      setAuthToken(token);
      router.push("/"); // Redirect to home page after successful login
    } catch (err: any) {
      setError(err.response?.data?.message || "Error signing in");
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
            className="name"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email or Phone Number"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="password"
            placeholder="Password"
            required
          />
          <div className="btns flex flex-row items-center justify-between">
            <button type="submit" className="sign-btn">
              Sign In
            </button>
            <Link href="/forgotten_password">
              <input
                type="button"
                className="forgot-btn"
                value="Forget Password?"
              />
            </Link>
          </div>
        </form>

        <hr className="flex border border-[--text1] w-full border-solid items-center m-3" />

        <div className="social_btn flex flex-row gap-2 items-center justify-center min-w-full">
          <div
            onClick={() => signIn("google")}
            className="google flex flex-row gap-2 items-center justify-center p-3 rounded-full shadow hover:shadow-xl hover:bg-[--glass-bl]"
          >
            <Gicon className="g-icon" />
          </div>

          <div
            onClick={() => signIn("github")}
            className="google flex flex-row gap-2 items-center justify-center p-3 rounded-full shadow hover:shadow-xl hover:bg-[--glass-bl]"
          >
            <FaGithub className="g-icon" />
          </div>
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

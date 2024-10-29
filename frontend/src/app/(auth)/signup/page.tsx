"use client";

import React, {useEffect, useState, ChangeEvent, FormEvent} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import authApi from "@/utils/authApi";

import "./register.css";
import Image from "next/image";
import Link from "next/link";
import {signIn} from "next-auth/react";
import SignImg from "../../../assets/img/products/signin-img.png";
import Gicon from "../../../assets/img/products/Icon-Google.svg";
import { FaGithub } from "react-icons/fa";

export default function SignUp() {
  // const {data: session} = useSession();
  const [formData, setFormData] = useState({name: "", email: "", password: ""});
  const [error, setError] = useState<string>("");
  const router = useRouter();
  // const [userData, setUserData] = useState({name: "", email: ""});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // useEffect(() => {
  //   if (session) {
  //     setUserData({name: session.user?.name || "", email: session.user?.email});
  //   }
  // }, [session]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await authApi.post("/api/auth/register", formData);
      router.push("/signin"); // Redirect to sign-in page after successful sign-up
    } catch (err: any) {
      setError(err.response?.data?.message || "Error signing up");
    }
  };

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
          onSubmit={handleSubmit}
          className="flex flex-col relative items-center sign-form"
        >
          <input
            type="text"
            name="name"
            className="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            name="email"
            className="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
          <input
            type="password"
            name="password"
            className="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Set Password"
            required
          />
          <button type="submit" className="sign-btn">
            Create Account
          </button>
          {error && <p>{error}</p>}
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

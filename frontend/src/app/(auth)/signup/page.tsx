"use client";

import React, {useEffect, useState, ChangeEvent, FormEvent} from "react";

import {useRouter} from "next/navigation";
import authApi from "@/utils/authApi";

import "./register.css";
import Image from "next/image";
import Link from "next/link";
import SignImg from "../../../assets/img/products/signin-img.png";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setError(""); // Clear error when user types
  };

  const validateForm = (): boolean => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setError("All fields are required");
      return false;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Remove /api from the URL since it's included in the baseURL
      const response = await authApi.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (response.data) {
        router.push("/signin");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Error during registration");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="signup_section flex flex-row w-full h-full items-center justify-center">
      <div className="signup_img w-[50%] h-fit">
        <Image
          src={SignImg}
          className="sign-logo"
          width={500}
          height={300}
          alt="Sign Up Logo"
          priority
        />
      </div>
      <div className="signup_container w-[40%] gap-2 flex flex-col items-start justify-center relative">
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
          {error && (
            <div className="error-message text-red-500 mb-4 w-full text-center">
              {error}
            </div>
          )}
          <input
            type="text"
            name="name"
            className="name w-full"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            disabled={isLoading}
            required
          />
          <input
            type="email"
            name="email"
            className="email w-full"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            disabled={isLoading}
            required
          />
          <input
            type="tel"
            name="phone"
            className="phone w-full"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            className="password w-full"
            value={formData.password}
            onChange={handleChange}
            placeholder="Set Password"
            disabled={isLoading}
            required
          />
          <input
            type="password"
            name="confirm_password"
            className="password w-full"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Confirm Password"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            className="sign-btn w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <hr className="w-full border-[--text1] my-4 ml-[40px] " />

        <div className="sign-re flex justify-center w-full">
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

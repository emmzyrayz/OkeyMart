"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect} from "react";
import {useRouter} from "next/navigation";
import authApi, {setAuthToken} from "@/utils/authApi";
import {GridLoad} from "@/components/fetchloading/btnloading";
import "./login.css";
import Image from "next/image";
import Link from "next/link";
import SignImg from "../../../assets/img/products/signin-img.png";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import {
  initializeTokenManagement,
  startTokenRefreshTimer,
  handleLogout,
} from "@/utils/tokenManager";
import {useUser} from "@/context/userContext/UserContext";

export default function SignIn() {
  const {login, isLoading, error: contextError} = useUser();
  const [formData, setFormData] = useState({email: "", password: ""});
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    // Clear error when user starts typing
    if (error) setError("");
  };

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();

  //   // Validate input
  //   if (!formData.email || !formData.password) {
  //     setError("Please enter both email and password");
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError("");

  //   try {
  //     // const response = await authApi.post("/api/auth/login", formData);
  //     const response = await authApi.post("/api/auth/login", {
  //       email: formData.email.trim(),
  //       password: formData.password,
  //     });

  //     const {token, user} = response.data;

  //     // Validate token and user data
  //     if (!token || !user) {
  //       throw new Error("Invalid response from server");
  //     }

  //     // Store token with timestamp for expiry tracking
  //     localStorage.setItem("token", token);
  //     localStorage.setItem("tokenTimestamp", Date.now().toString());

  //     // Store user details with more comprehensive information
  //     localStorage.setItem("userId", user.id);
  //     localStorage.setItem("userEmail", user.email);
  //     localStorage.setItem(
  //       "userData",
  //       JSON.stringify({
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //         role: user.role,
  //         phone: user.phone,
  //         verificationStatus: user.verificationStatus,
  //       })
  //     );

  //     setAuthToken(token);

  //     // Update user context with full user object
  //     setUser({
  //       id: user.id,
  //       name: user.name,
  //       email: user.email,
  //       role: user.role,
  //       isAuthenticated: true,
  //     });

  //     // Initialize token management
  //     initializeTokenManagement();
  //     startTokenRefreshTimer();

  //     // Role-based redirection
  //     switch (user.role) {
  //       case "Buyer":
  //         router.push("/");
  //         break;
  //       case "Seller":
  //         router.push("/store");
  //         break;
  //       case "Admin":
  //         router.push("/admin-dashboard");
  //         break;
  //       default:
  //         router.push("/");
  //     }
  //   } catch (error: any) {
  //     // Comprehensive error handling
  //     console.error("Login Error:", error);

  //     let errorMessage = "An unexpected error occurred";

  //     if (error.response) {
  //       // The request was made and the server responded with a status code
  //       switch (error.response.status) {
  //         case 401:
  //           errorMessage = "Invalid email or password";
  //           break;
  //         case 403:
  //           errorMessage = "Account is suspended or not verified";
  //           break;
  //         case 500:
  //           errorMessage = "Server error. Please try again later.";
  //           break;
  //         default:
  //           errorMessage = error.response.data.message || errorMessage;
  //       }
  //     } else if (error.request) {
  //       // The request was made but no response was received
  //       errorMessage = "No response from server. Please check your connection.";
  //     } else {
  //       // Something happened in setting up the request
  //       errorMessage = error.message || "Login failed. Please try again.";
  //     }

  //     setError("Invalid email or password");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      await login(formData.email.trim(), formData.password);
      // The UserContext will handle the redirection based on user role
    } catch (error: any) {
      setError(error.message || "Invalid email or password");
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
          {(error || contextError) && (
            <div className="error-message text-red-500 mb-4 w-full text-center">
              {error || contextError}
            </div>
          )}
          <input
            type="email"
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

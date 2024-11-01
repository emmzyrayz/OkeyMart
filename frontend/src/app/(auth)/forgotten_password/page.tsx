'use client'
import {useState, ChangeEvent, FormEvent} from "react";
import authApi from "@/utils/authApi"; 
import "./forgot-password.css";
import Image from "next/image";
import SignImg from "../../../assets/img/products/signin-img.png";
import { GridLoad } from "@/components/fetchloading/btnloading";
import Link from "next/link";



export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(""); // 50 seconds timer

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    };

    const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
    };

    const handleRequestReset = async (e: FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const response = await authApi.post("/api/auth/request-reset", {email});
        setMessage(response.data.message);
      } catch (error: any) {
        setMessage(
          error.response?.data?.message || "Error requesting reset code"
        );
      } finally {
        setIsLoading(false);
      }
    };

    const handleResetPassword = async (e: FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match");
        return;
      }

      try {
        const response = await authApi.post("/api/auth/reset-password", {
          resetToken,
          newPassword,
        });
        setMessage(response.data.message);
        setCodeSent(false); // Reset the form
      } catch (error: any) {
        setMessage(error.response?.data?.message || "Error resetting password");
      }
    };


  return (
    <div className="signup_section flex flex-row w-full h-full items-center justify-center">
      <div className="signup_img w-[50%] h-fit">
        <Image
          src={SignImg}
          className="sign-logo  flex items-center justify-center"
          width={500}
          height={300}
          alt="Sign Up Logo"
        />
      </div>
      <div className="signup_container w-[40%] gap-2 flex flex-col items-start justify-center">
        <div className="sign_head">
          <span>Forgot Password?</span>
        </div>
        <div className="sign_desc">
          <span>Enter your Email below</span>
        </div>

        <p>{message}</p>

        {!codeSent ? (
          <form
            onSubmit={handleRequestReset}
            className="flex flex-col relative items-center sign-form"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              autoComplete="off"
              required
            />
            <button type="submit" className="sign-btn" disabled={isLoading}>
              {isLoading ? <GridLoad /> : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              placeholder="Enter the reset token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <button type="submit" className="sign-btn">
              Reset Password
            </button>
          </form>
        )}

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

'use client'
import {useState, ChangeEvent, FormEvent, useEffect} from "react";
import authApi from "@/utils/authApi"; 
import "./forgot-password.css";
import Image from "next/image";
import SignImg from "../../../assets/img/products/signin-img.png";
import { GridLoad } from "@/components/fetchloading/btnloading";
import Link from "next/link";



export default function ForgotPassword() {
  // Form states
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // Timer states
  const [codeExpiryTime, setCodeExpiryTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [resendTimeLeft, setResendTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft]);

  // Resend timer logic
  useEffect(() => {
    let resendTimer: NodeJS.Timeout;

    if (resendTimeLeft > 0) {
      resendTimer = setInterval(() => {
        setResendTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (resendTimer) clearInterval(resendTimer);
    };
  }, [resendTimeLeft]);

  // Password validation
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!minLength) return "Password must be at least 8 characters long";
    if (!hasUpperCase)
      return "Password must contain at least one uppercase letter";
    if (!hasLowerCase)
      return "Password must contain at least one lowercase letter";
    if (!hasNumbers) return "Password must contain at least one number";
    return "";
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setMessage("");
    setMessageType("");
  };

  const handleResetCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setResetCode(value);
    setMessage("");
    setMessageType("");
  };

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    const validationError = validatePassword(e.target.value);
    if (validationError) {
      setMessage(validationError);
      setMessageType("error");
    } else {
      setMessage("");
      setMessageType("");
    }
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (e.target.value && e.target.value !== newPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
    } else {
      setMessage("");
      setMessageType("");
    }
  };

  const startTimers = () => {
    // Set 30-minute expiry timer
    const expiryTime = Date.now() + 30 * 60 * 1000;
    setCodeExpiryTime(expiryTime);
    setTimeLeft(30 * 60);

    // Set resend cooldown timer (20 seconds)
    setResendTimeLeft(20);
    setCanResend(false);
  };

  const handleRequestReset = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await authApi.post("/api/auth/request-reset", {email});
      setMessage(response.data.message);
      setMessageType("success");
      setCodeSent(true);
      startTimers();
    } catch (error: any) {
      console.error("Reset request error:", error);
      setMessage(
        error.response?.data?.message ||
          "Error requesting reset code. Please try again."
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await authApi.post("/api/auth/request-reset", {email});
      setMessage("New reset code sent successfully!");
      setMessageType("success");
      startTimers();
      setResetCode(""); // Clear the previous code input
    } catch (error: any) {
      console.error("Resend code error:", error);
      setMessage(
        error.response?.data?.message ||
          "Error sending new reset code. Please try again."
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();

    // Check if code has expired
    if (Date.now() > codeExpiryTime) {
      setMessage("Reset code has expired. Please request a new code.");
      setMessageType("error");
      return;
    }

    // Validate password
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setMessage(validationError);
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await authApi.post("/api/auth/reset-password", {
        email,
        resetCode,
        newPassword,
      });

      setMessage(
        "Password reset successful! You can now login with your new password."
      );
      setMessageType("success");

      // Reset form after 3 seconds and redirect to login
      setTimeout(() => {
        window.location.href = "/signin";
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setMessage(
        error.response?.data?.message ||
          "Error resetting password. Please try again."
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
          <span>
            {!codeSent
              ? "Enter your Email below"
              : "Enter the reset code sent to your email"}
          </span>
        </div>

        {message && (
          <div
            className={`message ${messageType} p-3 rounded-md w-full text-sm ${
              messageType === "error"
                ? "bg-red-100 text-red-700"
                : messageType === "success"
                ? "bg-green-100 text-green-700"
                : ""
            }`}
          >
            {message}
          </div>
        )}

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
              className="w-full"
              autoComplete="off"
              required
            />
            <button
              type="submit"
              className="sign-btn w-full"
              disabled={isLoading}
            >
              {isLoading ? <GridLoad /> : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col relative items-center sign-form"
          >
            <div className="w-full mb-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Code expires in: {formatTime(timeLeft)}
              </span>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={!canResend || isLoading}
                className={`text-sm px-3 py-1 rounded ${
                  canResend
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {resendTimeLeft > 0
                  ? `Resend in ${resendTimeLeft}s`
                  : "Resend Code"}
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter 6-digit reset code"
              value={resetCode}
              onChange={handleResetCodeChange}
              className="w-full"
              pattern="\d{6}"
              maxLength={6}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className="w-full"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full"
              required
            />
            <button
              type="submit"
              className="sign-btn w-full"
              disabled={isLoading || !!message || timeLeft === 0}
            >
              {isLoading ? <GridLoad /> : "Reset Password"}
            </button>
          </form>
        )}

        <div className="sign-re flex justify-center items-end w-full">
          <span>
            Remember your password?{" "}
            <Link href="/login" className="link">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

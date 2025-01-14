'use client'
import {useState, ChangeEvent, FormEvent, useEffect} from "react";
import authApi from "@/utils/authApi"; 
import "./forgot-password.css";
import Image from "next/image";
import SignImg from "../../../assets/img/products/signin-img.png";
import { GridLoad } from "@/components/fetchloading/btnloading";
import Link from "next/link";
import { useUser } from "@/context/userContext/UserContext";



export default function ForgotPassword() {
  // Get context functions
  const {
    forgotPassword,
    resetPassword,
    error: contextError,
    isLoading,
  } = useUser();

  // Form states
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // Timer states
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

  // Update message when context error changes
  useEffect(() => {
    if (contextError) {
      setMessage(contextError);
      setMessageType("error");
    }
  }, [contextError]);

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
    setTimeLeft(30 * 60); // 30 minutes
    setResendTimeLeft(20); // 20 seconds cooldown
    setCanResend(false);
  };

 const handleRequestReset = async (e: FormEvent) => {
   e.preventDefault();
   try {
     await forgotPassword(email);
     setMessage("Reset code sent successfully!");
     setMessageType("success");
     setCodeSent(true);
     startTimers();
   } catch (error) {
     // Context error will be handled by the useEffect
   }
 };


 const handleResendCode = async () => {
   if (!canResend) return;

   try {
     await forgotPassword(email);
     setMessage("New reset code sent successfully!");
     setMessageType("success");
     startTimers();
     setResetCode(""); // Clear the previous code input
   } catch (error) {
     // Context error will be handled by the useEffect
   }
 };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();

    if (timeLeft === 0) {
      setMessage("Reset code has expired. Please request a new code.");
      setMessageType("error");
      return;
    }

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

    try {
      await resetPassword(email, resetCode, newPassword);
      setMessage("Password reset successful! Redirecting to login...");
      setMessageType("success");
    } catch (error) {
      // Context error will be handled by the useEffect
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

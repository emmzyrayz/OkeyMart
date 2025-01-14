"use client";

import React, { useState, ChangeEvent, FormEvent} from "react";

import {useRouter} from "next/navigation";
import authApi from "@/utils/authApi";
import { countries } from "@/components/input/phoneinput";

import "./register.css";
import Image from "next/image";
import Link from "next/link";
import SignImg from "../../../assets/img/products/signin-img.png";
import {FaEye, FaEyeSlash} from "react-icons/fa6";
import PhoneInput from "@/components/input/phoneinput";
import { GridLoad } from "@/components/fetchloading/btnloading";
import { useUser } from "@/context/userContext/UserContext";

interface FormData {
  name: string;
  email: string;
  phone: {
    value: string;
    isValid: boolean;
  };
  password: string;
  confirm_password: string;
}

interface InputState {
  value: string;
  touched: boolean;
  error: string;
}

interface FormState {
  [key: string]: InputState;
}

export default function SignUp() {
  const {register, isLoading, error: contextError} = useUser();
  const [formState, setFormState] = useState<FormState>({
    name: {value: "", touched: false, error: ""},
    email: {value: "", touched: false, error: ""},
    phone: {value: "", touched: false, error: ""},
    password: {value: "", touched: false, error: ""},
    confirm_password: {value: "", touched: false, error: ""},
  });

  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Set default country
  const [error, setError] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  const validateField = (
    name: string,
    value: string,
    compareValue?: string
  ): string => {
    switch (name) {
      case "email":
        if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          return "Please enter a valid email address";
        }
        break;
      case "password":
        if (value.length < 8) {
          return "Password must be at least 8 characters long";
        }
        break;
      case "confirm_password":
        if (value !== compareValue) {
          return "Passwords do not match";
        }
        break;
      case "phone":
        if (value && !value.match(/^\+?[\d\s-]{10,}$/)) {
          return "Please enter a valid phone number";
        }
        break;
    }
    return "";
  };

  // Phone number formatting function
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Format the number based on length
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length <= 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`;
    }
  };

  // Phone number validation function
  const validatePhoneNumber = (phone: string): string => {
    const digitsOnly = phone.replace(/\D/g, "");

    if (!phone) return ""; // Allow empty phone number
    if (
      selectedCountry.code === "NG" &&
      digitsOnly.length !== 11 &&
      digitsOnly.length !== 13
    ) {
      return "Phone number must be 11 digits (starting with 0) or 13 digits (starting with country code)";
    }
    if (selectedCountry.code === "US" && digitsOnly.length !== 10) {
      return "Phone number must be 10 digits";
    }
    // Check if the number starts with valid area code (assuming US numbers)
    if (selectedCountry.code === "US" && !/^[2-9]\d{2}/.test(digitsOnly)) {
      return "Invalid area code";
    }
    // Check if the exchange code is valid (second group of 3 digits)
    if (
      selectedCountry.code === "US" &&
      !/^[2-9]\d{2}[2-9]\d{6}$/.test(digitsOnly)
    ) {
      return "Invalid phone number format";
    }
    return "";
  };

  // const validateField = (
  //   name: string,
  //   value: string,
  //   compareValue?: string
  // ): string => {
  //   switch (name) {
  //     case "email":
  //       if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
  //         return "Please enter a valid email address";
  //       }
  //       break;
  //     case "password":
  //       if (value.length < 8) {
  //         return "Password must be at least 8 characters long";
  //       }
  //       break;
  //     case "confirm_password":
  //       if (value !== compareValue) {
  //         return "Passwords do not match";
  //       }
  //       break;
  //     case "phone":
  //       return validatePhoneNumber(value);
  //   }
  //   return "";
  // };

  const getInputClassName = (fieldName: string): string => {
    const field = formState[fieldName];
    const baseClasses = "w-full transition-all duration-300 border-b ";

    if (!field.touched) return baseClasses + "border-b-gray-300";
    if (field.error) return baseClasses + "border-b-red-500 border-b-2";
    return baseClasses + "border-b-green-500 border-b-2";
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    let newValue = value;

    // Special handling for phone numbers
    if (name === "phone") {
      // Only allow digits and basic formatting characters
      const sanitizedValue = value.replace(/[^\d-]/g, "");
      // Limit to max length (12 including hyphens for 10-digit number)
      if (sanitizedValue.replace(/-/g, "").length <= 10) {
        newValue = formatPhoneNumber(sanitizedValue);
      } else {
        // If exceeds max length, keep the previous value
        newValue = formState.phone.value;
      }
    }

    const error = validateField(
      name,
      newValue,
      name === "confirm_password" ? formState.password.value : undefined
    );

    setFormState((prev) => ({
      ...prev,
      [name]: {
        value: newValue,
        touched: true,
        error,
      },
    }));

    if (name === "password") {
      const strength = calculatePasswordStrength(newValue);
      setPasswordStrength(strength);

      if (formState.confirm_password.touched) {
        setFormState((prev) => ({
          ...prev,
          confirm_password: {
            ...prev.confirm_password,
            error:
              prev.confirm_password.value !== newValue
                ? "Passwords do not match"
                : "",
          },
        }));
      }
    }
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++; // Check for symbols
    return strength;
  };

  const getPasswordStrengthClass = (strength: number): string => {
    if (strength === 0) return "bg-gray-300";
    if (strength === 1) return "bg-red-500"; // Only the first bar is red
    if (strength >= 2 && strength < 4) return "bg-yellow-500"; // Second and third bars are yellow
    return "bg-green-500"; // All bars are green
  };

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   // Mark all fields as touched
  //   const updatedFormState = Object.keys(formState).reduce(
  //     (acc, key) => ({
  //       ...acc,
  //       [key]: {
  //         ...formState[key],
  //         touched: true,
  //         error: validateField(
  //           key,
  //           formState[key].value,
  //           key === "confirm_password" ? formState.password.value : undefined
  //         ),
  //       },
  //     }),
  //     formState
  //   );

  //   setFormState(updatedFormState);

  //   // Check for any errors
  //   const hasErrors = Object.values(updatedFormState).some(
  //     (field) => field.error
  //   );
  //   if (hasErrors) {
  //     setError("Please fix the errors before submitting");
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     const response = await authApi.post("/api/auth/register", {
  //       name: formState.name.value,
  //       email: formState.email.value,
  //       phone: formState.phone.value.replace(/\D/g, ""),
  //       password: formState.password.value,
  //     });

  //     if (response.data) {
  //       router.push("/signin");
  //     }
  //   } catch (err: any) {
  //     console.error("Registration error:", err);
  //     if (
  //       err.response?.status === 400 &&
  //       err.response?.data?.message === "Email already registered"
  //     ) {
  //       setError(
  //         "This email is already registered. Please use a different email."
  //       );
  //     } else {
  //       setError(
  //         err.response?.data?.message ||
  //           "Error during registration. Please try again."
  //       );
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched and validate
    const updatedFormState = Object.keys(formState).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          ...formState[key],
          touched: true,
          error: validateField(
            key,
            formState[key].value,
            key === "confirm_password" ? formState.password.value : undefined
          ),
        },
      }),
      formState
    );

    setFormState(updatedFormState);

    // Check for any errors
    const hasErrors = Object.values(updatedFormState).some(
      (field) => field.error
    );
    if (hasErrors) {
      setError("Please fix the errors before submitting");
      return;
    }

    try {
      await register({
        name: formState.name.value,
        email: formState.email.value,
        password: formState.password.value,
        phone: formState.phone.value,
      });
      // Registration successful - UserContext will handle the redirect
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
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
          {(error || contextError) && (
            <div className="error-message text-red-500 text-[12px] font-semibold w-full h-full flex items-center justify-center text-center">
              {error || contextError}
            </div>
          )}
          <input
            type="text"
            name="name"
            className={getInputClassName("name")}
            value={formState.name.value}
            onChange={handleChange}
            placeholder="Your Name"
            disabled={isLoading}
            required
          />

          <input
            type="email"
            name="email"
            className={getInputClassName("email")}
            value={formState.email.value}
            onChange={handleChange}
            placeholder="Your Email"
            disabled={isLoading}
            required
          />
          {formState.email.error && (
            <div className="error-message text-red-500 text-[12px] font-semibold w-full h-full flex items-center justify-center text-center">
              {formState.email.error}
            </div>
          )}
          <PhoneInput
            value={formState.phone.value}
            onChange={(value, isValid) => {
              setFormState((prev) => ({
                ...prev,
                phone: {
                  value: value,
                  touched: true,
                  error: isValid ? "" : "Please enter a valid phone number",
                },
              }));
            }}
            disabled={isLoading}
            className={getInputClassName("phone")}
          />
          {formState.phone.error && (
            <div className="error-message text-red-500 text-[12px] font-semibold w-full h-full flex items-center justify-center text-center">
              {formState.phone.error}
            </div>
          )}
          <div className="password-input relative">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              className={getInputClassName("password")}
              value={formState.password.value}
              onChange={handleChange}
              placeholder="Set Password"
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
          <div className="pass-er flex flex-row items-center justify-between  w-full h-[30px]">
            {formState.password.error && (
              <div className="error-message text-red-500 text-[12px] font-semibold w-full h-full flex items-center justify-center text-center">
                {formState.password.error}
              </div>
            )}
            <div className="password-strength w-full items-center flex-row justify-end flex space-x-1 h-full">
              {[...Array(4)].map((_, index) => (
                <span
                  key={index}
                  className={`${
                    index < passwordStrength
                      ? getPasswordStrengthClass(passwordStrength)
                      : "bg-gray-300"
                  } w-[10%] h-[5px] rounded-lg`} // Use rounded-full for pill shape
                />
              ))}
            </div>
          </div>
          <input
            type={passwordVisible ? "text" : "password"}
            name="confirm_password"
            className={getInputClassName("confirm_password")}
            value={formState.confirm_password.value}
            onChange={handleChange}
            placeholder="Confirm Password"
            disabled={isLoading}
            required
          />
          {formState.confirm_password.error && (
            <div className="error-message text-red-500 text-[12px] font-semibold w-full h-full flex items-center justify-center text-center">
              {formState.confirm_password.error}
            </div>
          )}
          <button
            type="submit"
            className="sign-btn w-full hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? <GridLoad /> : "Sign Up"}
          </button>
        </form>
        {/* <hr className="w-[200px] border-[--text1] my-4 ml-[40px] " /> */}

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

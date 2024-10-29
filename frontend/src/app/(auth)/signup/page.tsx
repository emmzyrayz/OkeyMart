'use client'

import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

import './register.css';
import Image from 'next/image';
import Link from 'next/link';
import {signIn} from 'next-auth/react'
import SignImg from '../../../assets/img/products/signin-img.png';
import Gicon from '../../../assets/img/products/Icon-Google.svg';


export default function SignUp() {

  const { data: session } = useSession();
    const router = useRouter();
    const [userData, setUser Data] = useState({ name: '', email: '' });

    useEffect(() => {
        if (session) {
            setUser Data({ name: session.user.name || '', email: session.user.email });
        }
    }, [session]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle registration logic here
        try {
        // Save userData to your database
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        const data = await res.json();

        if (data.message === "Registered successfully") {
            router.push("/"); // Redirect to homepage after registration
        } else {
            // Handle registration errors
        }
    } catch (error) {
        console.error(error);
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
              className="name"
              value={userData.name}
              onChange={(e) => setUser Data({ ...userData, name: e.target.value })}
              placeholder="Your Name"
              required
            />
            <input
              type="email"
              className="email"
              placeholder="Your Email"
              required
            />
            <input
              type="password"
              className="password"
              value={userData.email}
              onChange={(e) => setUser Data({ ...userData, email: e.target.value })}
              placeholder="Your Email"
              required
            />
            <input type="button" className="sign-btn" value="Create Account" />
            <div className="google flex flex-row gap-2 items-center justify-center">
              <Gicon className="g-icon" />
              <input
                type="button"
                value="Sign Up with Google"
                className="google-signup-btn"
              />
            </div>
          </form>
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
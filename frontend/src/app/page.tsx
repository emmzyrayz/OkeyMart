'use client'

import { signIn, useSession } from 'next-auth/react';
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import authApi, {setAuthToken} from "@/utils/authApi";
import axios from "axios";

import '@fontsource/inter/400.css';  // Inter Regular
import '@fontsource/inter/500.css';  // Inter Medium
import '@fontsource/inter/700.css';  // Inter Bold

import '@fontsource/poppins/400.css';  // Poppins Regular
import '@fontsource/poppins/500.css';  // Poppins Medium
import '@fontsource/poppins/700.css';  // Poppins Bold
import { HomePage } from '@/components/home/page';
import Link from 'next/link';

export default function Home() {
  const {data: session, status} = useSession();
  const router = useRouter();

  // Redirect to /signin if the user is not logged in and the session status is "unauthenticated"
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    } else {
      setAuthToken(token);
    }
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      // Call logout endpoint to invalidate token on server
      await axios.post("/auth/logout", null, {
        headers: {Authorization: `Bearer ${token}`},
      });
    } catch (error) {
      console.error("Failed to log out on server:", error);
    }

    // Clear the token from local storage
    localStorage.removeItem("token");

    // Redirect to the sign-in page
    router.push("/signin");
  };
  
  return (
    <div>
      {session ? (
        <div>
          <HomePage />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <h1 className="text-lg text-black font-medium gap-2 w-full h-full flex flex-col p-5">
            You're Not logged in, You would be automatically redirected to
            <Link href="/signin" className='bg-green-500 rounded-lg p-2'>/signin page</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white rounded-lg p-2"
            >
              Log Out
            </button>
          </h1>
        </div>
      )}
    </div>
  );
}

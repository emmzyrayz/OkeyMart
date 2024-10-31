'use client'

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
// import Link from 'next/link';

export default function Home() {
  // const {data: session, status} = useSession();
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
        <div>
          <div onClick={handleLogout} className="flex absolute p-5 bg-red-500 hover:bg-red-400 focus:opacity-50 shadow-lg top-12 right-12 rounded-lg text-lg font-medium text-white cursor-pointer"> log out</div>
          <HomePage />
        </div>
    </div>
  );
}

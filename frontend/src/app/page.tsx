'use client'

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import authApi, {setAuthToken} from "@/utils/authApi";
import {
  initializeActivityTracking,
  cleanupActivityTracking,
} from "@/utils/tokenManager";
import {useUser} from "@/context/userContext/UserContext";
import {hasPermission} from "@/utils/roleUtils";

import '@fontsource/inter/400.css';  // Inter Regular
import '@fontsource/inter/500.css';  // Inter Medium
import '@fontsource/inter/700.css';  // Inter Bold

import '@fontsource/poppins/400.css';  // Poppins Regular
import '@fontsource/poppins/500.css';  // Poppins Medium
import '@fontsource/poppins/700.css';  // Poppins Bold
import { HomePage } from '@/components/home/page';
// import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const {user} = useUser();

  // Redirect to /signin if the user is not logged in and the session status is "unauthenticated"
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    } else {
      setAuthToken(token);
      initializeActivityTracking();
    }

    return () => {
      cleanupActivityTracking();
    };
  }, [router]);

  // Conditionally render components based on user role and permissions
  if (hasPermission(user.role, "view_products")) {
    // Render product-related components
  } else if (hasPermission(user.role, "manage_products")) {
    // Render product management components
  } else {
    // Render default or unauthorized components
  }

  return (
    <div>
      <div>
        <HomePage />
      </div>
    </div>
  );
}

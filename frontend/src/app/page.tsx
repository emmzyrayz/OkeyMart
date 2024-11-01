'use client'

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {setAuthToken} from "@/utils/authApi";


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

  
  
  return (
    <div>
        <div>
          <HomePage />
        </div>
    </div>
  );
}

'use client'

import { signIn, useSession } from 'next-auth/react';
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";

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
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  
  return (
    <div>
      {session ? (
        <div>
          <HomePage />
        </div>
      ) : (
        <div className='flex items-center justify-center w-full h-full'>
          <h1 className="text-lg text-black font-medium">
            You're Not logged in, You would be automatically redirected to 
            <Link href='/signin'>
              /signin page
            </Link>
          </h1>
        </div>
      )}
    </div>
  );
}

'use client'
import React, {useEffect, useState} from "react";
import {useSearchParams, useRouter} from "next/navigation"; // Use next/navigation in App Router
import axios from "axios";

const EmailVerificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState({
    loading: true,
    success: false,
    message: "Verifying your email...",
  });

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus({
          loading: false,
          success: false,
          message: "No verification token found.",
        });
        return;
      }

      try {
        const response = await axios.post("/api/auth/verifyEmail", {
          token: token,
        });

        setStatus({
          loading: false,
          success: true,
          message: response.data.message || "Email verified successfully!",
        });

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      } catch (error: any) {
        setStatus({
          loading: false,
          success: false,
          message:
            error.response?.data?.message || "Email verification failed.",
        });
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="rounded-md bg-white p-8 shadow-lg">
          {status.loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Verifying email...</p>
            </div>
          ) : (
            <div className="text-center">
              {status.success ? (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
              <h2
                className={`mt-4 text-xl font-medium ${
                  status.success ? "text-green-900" : "text-red-900"
                }`}
              >
                {status.success ? "Email Verified" : "Verification Failed"}
              </h2>
              <p className="mt-2 text-sm text-gray-500">{status.message}</p>
              {!status.success && (
                <button
                  onClick={() => router.push("/resend-verification")}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Resend Verification Email
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;

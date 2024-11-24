import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {token} = body;

    if (!token) {
      return NextResponse.json(
        {message: "Verification token is required"},
        {status: 400}
      );
    }

    // Forward the verification request to your backend
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/auth/verify-email`,
      {token},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      {
        message:
          error.response?.data?.message ||
          "Server error during email verification",
        success: false,
      },
      {status: error.response?.status || 500}
    );
  }
}
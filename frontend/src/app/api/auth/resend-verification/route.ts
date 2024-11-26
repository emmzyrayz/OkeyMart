import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {email} = body;

    if (!email) {
      return NextResponse.json({message: "Email is required"}, {status: 400});
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification`,
      {email},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      {
        message:
          error.response?.data?.message ||
          "Server error while resending verification email",
      },
      {status: error.response?.status || 500}
    );
  }
}
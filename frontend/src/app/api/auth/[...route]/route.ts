// src/app/api/auth/[...route]/route.ts
import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import {EncryptionUtility} from "@/utils/encryption";
import {generateToken} from "@/lib/auth/jwt";
import {TokenManager} from "@/utils/middle-utils";
import connectDB from "@/lib/dbconnect"; // Fixed spelling
import User, {
  IUser,
  UserRole,
  UserStatus,
  VerificationStatus,
} from "@/models/user";

import crypto from 'crypto';
import {Types, Document} from 'mongoose';

interface UserDocument extends Document, IUser {
  _id: Types.ObjectId;
}

// Update the handling of environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// Initialize utilities
const encryptionUtil = new EncryptionUtility({
  key: process.env.NEXT_PUBLIC_ENCRYPTION_KEY!,
  iv: process.env.NEXT_PUBLIC_DETERMINISTIC_IV,
});

const tokenManager = TokenManager.getInstance();

// Rate limiting interface
interface RateLimitRequest {
  ip: string;
  timestamp: number;
  count: number;
}

const rateLimits = new Map<string, RateLimitRequest>();

function checkRateLimit(ip: string, limit: number): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window

  const current = rateLimits.get(ip) || {ip, timestamp: now, count: 0};

  if (now - current.timestamp > windowMs) {
    current.timestamp = now;
    current.count = 1;
  } else {
    current.count += 1;
  }

  rateLimits.set(ip, current);
  return current.count <= limit;
}

export async function POST(
  request: NextRequest,
  {params}: {params: {route: string[]}}
) {
  try {
    await connectDB();
    const route = params.route[0];
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Rate limiting
    if (!checkRateLimit(ip, 10)) {
      return NextResponse.json({message: "Too many requests"}, {status: 429});
    }

    switch (route) {
      case "register":
        return handleRegister(request);
      case "login":
        return handleLogin(request);
      case "verify-email":
        return handleEmailVerification(request);
      case "forgot-password":
        return handleForgotPassword(request);
      case "reset-password":
        return handleResetPassword(request);
      case "resend-verification":
        return handleResendVerification(request);
      case "logout":
        return handleLogout(request);
      default:
        return NextResponse.json({message: "Route not found"}, {status: 404});
    }
  } catch (error: any) {
    console.error("Auth API Error:", error);
    return NextResponse.json(
      {message: "Internal server error", error: error.message},
      {status: 500}
    );
  }
}

async function handleRegister(request: NextRequest) {
  const body = await request.json();
  const {email, password, name, phone} = body;

  // Validation
  if (!email || !password || !name) {
    return NextResponse.json(
      {message: "Missing required fields"},
      {status: 400}
    );
  }

  // Check if user exists
  const existingUser = await User.findOne({email});
  if (existingUser) {
    return NextResponse.json(
      {message: "Email already registered"},
      {status: 400}
    );
  }

  // Generate verification token first
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // In the handleRegister function, update the user creation:
  const user = new User({
    name,
    email,
    phone,
    password,
    role: UserRole.Buyer,
    status: UserStatus.Active,
    emailVerification: {
      isVerified: false,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  await user.save();

 

  return NextResponse.json(
    {
      message: "Registration successful",
      verificationToken: user.emailVerification.verificationToken,
    },
    {status: 201}
  );
}

async function handleLogin(request: NextRequest) {
  const body = await request.json();
  const {email, password} = body;

  const user = (await User.findOne({email}).select("+password")) as
    | (IUser & Document)
    | null;
  if (!user) {
    return NextResponse.json({message: "Invalid credentials"}, {status: 401});
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return NextResponse.json({message: "Invalid credentials"}, {status: 401});
  }

  // Now TypeScript knows user._id exists and is of the correct type
  const token = generateToken(user._id.toString(), user.email, user.role);
  tokenManager.updateTokenActivity(user._id.toString());

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const userData = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    emailVerification: user.emailVerification,
    verificationStatus: user.verificationStatus,
    verificationBadge: user.verificationBadge,
  };

  return NextResponse.json({token, user: userData});
}

async function handleEmailVerification(request: NextRequest) {
  const {verificationToken} = await request.json();

  const user = await User.findOne({
    "emailVerification.verificationToken": verificationToken,
    "emailVerification.verificationTokenExpires": {$gt: Date.now()},
  });

  if (!user) {
    return NextResponse.json(
      {message: "Invalid or expired verification token"},
      {status: 400}
    );
  }

  user.verifyEmail();
  await user.save();

  return NextResponse.json({message: "Email verified successfully"});
}

async function handleForgotPassword(request: NextRequest) {
  const {email} = await request.json();
  const user = await User.findOne({email});

  if (!user) {
    return NextResponse.json(
      {message: "If an account exists, a reset email will be sent"},
      {status: 200}
    );
  }

  const resetCode = user.generateResetToken();
  await user.save();

  await sendResetPasswordEmail(email, resetCode);

  return NextResponse.json({message: "Reset instructions sent"});
}

async function handleResetPassword(request: NextRequest) {
  const {email, code, newPassword} = await request.json();

  const user = await User.findOne({
    email,
    "resetPassword.code": code,
    "resetPassword.expires": {$gt: Date.now()},
    "resetPassword.used": false,
  });

  if (!user) {
    return NextResponse.json(
      {message: "Invalid or expired reset code"},
      {status: 400}
    );
  }

  // Check password history
  const isPasswordReused = await user.isPasswordInHistory(newPassword);
  if (isPasswordReused) {
    return NextResponse.json(
      {message: "Cannot reuse recent passwords"},
      {status: 400}
    );
  }

  user.password = newPassword;
  user.resetPassword.used = true;
  await user.save();

  return NextResponse.json({message: "Password reset successful"});
}

async function handleResendVerification(request: NextRequest) {
  const {email} = await request.json();

  const user = await User.findOne({email});
  if (!user || user.emailVerification.isVerified) {
    return NextResponse.json({message: "Invalid request"}, {status: 400});
  }

  const verificationToken = user.generateVerificationToken();
  await user.save();


  return NextResponse.json({message: "Verification email sent"});
}

// Update handleLogout function for proper JWT_SECRET handling
async function handleLogout(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (token && JWT_SECRET) { // Use the JWT_SECRET we validated at the top
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
      };
      tokenManager.revokeToken(decoded.userId);
    } catch (error) {
      console.error("Token verification failed during logout:", error);
    }
  }

  return NextResponse.json({message: "Logged out successfully"});
}

export async function GET(
  request: NextRequest,
  {params}: {params: {route: string[]}}
) {
  const route = params.route[0];

  if (route === "me") {
    return handleGetUserProfile(request);
  }

  return NextResponse.json({message: "Route not found"}, {status: 404});
}

async function handleGetUserProfile(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({message: "Unauthorized"}, {status: 401});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId).select(
      "-password -passwordHistory -resetPassword"
    );

    if (!user) {
      return NextResponse.json({message: "User not found"}, {status: 404});
    }

    return NextResponse.json({user});
  } catch (error) {
    return NextResponse.json({message: "Invalid token"}, {status: 401});
  }
}

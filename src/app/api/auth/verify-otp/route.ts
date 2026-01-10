import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyOTP, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth/config";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const isValid = verifyOTP(email, otp);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 401 }
      );
    }

    // Check if user already has Pro status from Paddle cookie
    const cookieStore = await cookies();
    const proStatus = cookieStore.get("paddle_pro_status")?.value;
    const isPro = proStatus === "true";

    // Create session response
    const response = NextResponse.json({
      success: true,
      user: {
        email: email.toLowerCase(),
        isPro,
      },
    });

    // Set session cookie with email
    response.cookies.set(SESSION_COOKIE_NAME, email.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}

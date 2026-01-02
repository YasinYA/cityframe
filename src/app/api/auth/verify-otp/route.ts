import { NextRequest, NextResponse } from "next/server";
import { verifyOTP, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth/config";
import { stripe } from "@/lib/stripe/config";

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

    // Find or create Stripe customer for this email
    const customers = await stripe.customers.list({
      email: email.toLowerCase(),
      limit: 1,
    });

    let customerId: string;
    let isPro = false;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      isPro = customers.data[0].metadata?.pro === "true";
    } else {
      const customer = await stripe.customers.create({
        email: email.toLowerCase(),
      });
      customerId = customer.id;
    }

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

    // Also set stripe customer ID cookie
    response.cookies.set("stripe_customer_id", customerId, {
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

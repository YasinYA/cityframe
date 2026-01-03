import { NextRequest, NextResponse } from "next/server";
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

    let customerId: string | null = null;
    let isPro = false;

    // Only use Stripe if configured
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const { stripe } = await import("@/lib/stripe/config");

        // Find or create Stripe customer for this email
        const customers = await stripe.customers.list({
          email: email.toLowerCase(),
          limit: 1,
        });

        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
          isPro = customers.data[0].metadata?.pro === "true";
        } else {
          const customer = await stripe.customers.create({
            email: email.toLowerCase(),
          });
          customerId = customer.id;
        }
      } catch (stripeError) {
        console.warn("Stripe not configured, skipping customer creation:", stripeError);
      }
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

    // Also set stripe customer ID cookie if available
    if (customerId) {
      response.cookies.set("stripe_customer_id", customerId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
      });
    }

    return response;
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Get or create a customer ID from cookies
    const cookieStore = await cookies();
    let customerId = cookieStore.get("stripe_customer_id")?.value;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          anonymous: "true",
        },
      });
      customerId = customer.id;
    }

    // Create one-time payment checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment", // One-time payment
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        customerId,
      },
    });

    const response = NextResponse.json({ sessionId: session.id });
    response.cookies.set("stripe_customer_id", customerId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 years for lifetime access
    });

    return response;
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

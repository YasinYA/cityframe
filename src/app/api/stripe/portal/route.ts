import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const customerId = cookieStore.get("stripe_customer_id")?.value;

    if (!customerId) {
      return NextResponse.json(
        { error: "No customer found" },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Portal session error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}

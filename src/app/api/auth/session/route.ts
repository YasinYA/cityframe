import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { stripe } from "@/lib/stripe/config";

export type SessionResponse = {
  authenticated: boolean;
  user: {
    email: string;
    isPro: boolean;
  } | null;
};

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const customerId = cookieStore.get("stripe_customer_id")?.value;

    if (!sessionEmail) {
      return NextResponse.json<SessionResponse>({
        authenticated: false,
        user: null,
      });
    }

    let isPro = false;

    if (customerId) {
      try {
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted) {
          isPro = customer.metadata?.pro === "true";
        }
      } catch {
        // Customer not found, that's ok
      }
    }

    return NextResponse.json<SessionResponse>({
      authenticated: true,
      user: {
        email: sessionEmail,
        isPro,
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json<SessionResponse>({
      authenticated: false,
      user: null,
    });
  }
}

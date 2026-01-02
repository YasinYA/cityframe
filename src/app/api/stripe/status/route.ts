import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { cookies } from "next/headers";

export type PurchaseStatus = {
  isPro: boolean;
  purchasedAt: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const customerId = cookieStore.get("stripe_customer_id")?.value;

    if (!customerId) {
      return NextResponse.json<PurchaseStatus>({
        isPro: false,
        purchasedAt: null,
      });
    }

    // Get customer and check metadata for Pro status
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      return NextResponse.json<PurchaseStatus>({
        isPro: false,
        purchasedAt: null,
      });
    }

    const isPro = customer.metadata?.pro === "true";
    const purchasedAt = customer.metadata?.purchasedAt || null;

    return NextResponse.json<PurchaseStatus>({
      isPro,
      purchasedAt,
    });
  } catch (error) {
    console.error("Purchase status error:", error);
    return NextResponse.json<PurchaseStatus>({
      isPro: false,
      purchasedAt: null,
    });
  }
}

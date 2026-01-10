import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export type PurchaseStatus = {
  isPro: boolean;
  purchasedAt: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const customerId = cookieStore.get("paddle_customer_id")?.value;
    const proStatus = cookieStore.get("paddle_pro_status")?.value;
    const purchasedAt = cookieStore.get("paddle_purchased_at")?.value;

    // Check if user has Pro status from cookie
    if (proStatus === "true") {
      return NextResponse.json<PurchaseStatus>({
        isPro: true,
        purchasedAt: purchasedAt || null,
      });
    }

    // If we have a customer ID, we could verify with Paddle API
    // For now, we'll rely on the cookie set after successful checkout
    if (customerId) {
      // Optional: Verify with Paddle API
      // const { paddle } = await import("@/lib/paddle/config");
      // const customer = await paddle.customers.get(customerId);
    }

    return NextResponse.json<PurchaseStatus>({
      isPro: false,
      purchasedAt: null,
    });
  } catch (error) {
    console.error("Purchase status error:", error);
    return NextResponse.json<PurchaseStatus>({
      isPro: false,
      purchasedAt: null,
    });
  }
}

// POST to update Pro status after successful checkout
export async function POST(request: NextRequest) {
  try {
    const { customerId, transactionId } = await request.json();

    const response = NextResponse.json({ success: true });

    // Set cookies for Pro status
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 years for lifetime access
    };

    if (customerId) {
      response.cookies.set("paddle_customer_id", customerId, cookieOptions);
    }

    response.cookies.set("paddle_pro_status", "true", cookieOptions);
    response.cookies.set(
      "paddle_purchased_at",
      new Date().toISOString(),
      cookieOptions
    );

    if (transactionId) {
      response.cookies.set("paddle_transaction_id", transactionId, cookieOptions);
    }

    return response;
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}

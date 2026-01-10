import { NextResponse } from "next/server";

export async function GET() {
  // Return fallback if Paddle is not configured
  if (!process.env.PADDLE_API_KEY || !process.env.PADDLE_PRO_PRICE_ID) {
    return NextResponse.json({
      id: "fallback",
      amount: 9.99,
      currency: "usd",
      name: "Pro",
      description: "Lifetime access to all features",
    });
  }

  try {
    const { paddle } = await import("@/lib/paddle/config");
    const priceId = process.env.PADDLE_PRO_PRICE_ID;

    const price = await paddle.prices.get(priceId);

    // Paddle returns amount in minor units (cents)
    const amount = price.unitPrice?.amount
      ? parseInt(price.unitPrice.amount) / 100
      : 0;

    return NextResponse.json({
      id: price.id,
      amount,
      currency: price.unitPrice?.currencyCode?.toLowerCase() || "usd",
      name: price.name || "Pro",
      description: price.description || "Lifetime access to all features",
    });
  } catch (error) {
    console.error("Error fetching price:", error);
    // Return fallback on error
    return NextResponse.json({
      id: "fallback",
      amount: 9.99,
      currency: "usd",
      name: "Pro",
      description: "Lifetime access to all features",
    });
  }
}

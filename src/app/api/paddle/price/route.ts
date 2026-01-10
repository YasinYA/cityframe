import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const debug = new URL(request.url).searchParams.get("debug") === "true";

  // Check env vars
  const hasApiKey = !!process.env.PADDLE_API_KEY;
  const hasPriceId = !!process.env.PADDLE_PRO_PRICE_ID;
  const priceId = process.env.PADDLE_PRO_PRICE_ID;

  // Return fallback if Paddle is not configured
  if (!hasApiKey || !hasPriceId) {
    return NextResponse.json({
      id: "fallback",
      amount: 9.99,
      currency: "usd",
      name: "Pro",
      description: "Lifetime access to all features",
      ...(debug && {
        debug: {
          reason: "missing_env",
          hasApiKey,
          hasPriceId,
        },
      }),
    });
  }

  try {
    const { paddle } = await import("@/lib/paddle/config");

    const price = await paddle.prices.get(priceId!);

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
      ...(debug && {
        debug: {
          reason: "success",
          priceId,
        },
      }),
    });
  } catch (error) {
    console.error("Error fetching price:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Return fallback on error
    return NextResponse.json({
      id: "fallback",
      amount: 9.99,
      currency: "usd",
      name: "Pro",
      description: "Lifetime access to all features",
      ...(debug && {
        debug: {
          reason: "api_error",
          error: errorMessage,
          priceId,
          hasApiKey,
        },
      }),
    });
  }
}

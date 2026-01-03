import { NextResponse } from "next/server";

export async function GET() {
  // Return fallback if Stripe is not configured
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRO_PRICE_ID) {
    return NextResponse.json({
      id: "fallback",
      amount: 9.99,
      currency: "usd",
      name: "Pro",
      description: "Lifetime access to all features",
    });
  }

  try {
    const { stripe } = await import("@/lib/stripe/config");
    const priceId = process.env.STRIPE_PRO_PRICE_ID;

    const price = await stripe.prices.retrieve(priceId, {
      expand: ["product"],
    });

    const product = price.product as import("stripe").Stripe.Product;

    return NextResponse.json({
      id: price.id,
      amount: price.unit_amount ? price.unit_amount / 100 : 0,
      currency: price.currency,
      name: product.name,
      description: product.description,
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

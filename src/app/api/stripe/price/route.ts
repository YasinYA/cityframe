import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";

export async function GET() {
  try {
    const priceId = process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID not configured" },
        { status: 500 }
      );
    }

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
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}

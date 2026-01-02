import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

// One-time payment for lifetime Pro access
export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;

export interface PriceData {
  id: string;
  amount: number;
  currency: string;
  name: string;
  description: string | null;
}

export async function fetchPriceData(): Promise<PriceData | null> {
  try {
    const res = await fetch("/api/stripe/price");
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const environment = process.env.NODE_ENV === "production"
  ? Environment.production
  : Environment.sandbox;

export const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment,
});

// One-time payment for lifetime Pro access
export const PRO_PRICE_ID = process.env.PADDLE_PRO_PRICE_ID;

export interface PriceData {
  id: string;
  amount: number;
  currency: string;
  name: string;
  description: string | null;
}

export async function fetchPriceData(): Promise<PriceData | null> {
  try {
    const res = await fetch("/api/paddle/price");
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

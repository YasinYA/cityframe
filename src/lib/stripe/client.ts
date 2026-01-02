import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};

export async function createCheckoutSession(priceId: string) {
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ priceId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  const { sessionId } = await response.json();
  const stripe = await getStripe();

  if (!stripe) {
    throw new Error("Stripe failed to load");
  }

  const { error } = await (stripe as unknown as { redirectToCheckout: (opts: { sessionId: string }) => Promise<{ error?: Error }> }).redirectToCheckout({ sessionId });

  if (error) {
    throw error;
  }
}

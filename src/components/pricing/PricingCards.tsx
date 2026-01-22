"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { openPolarCheckout } from "@/lib/polar/client";
import { SignInModal } from "@/components/auth/SignInModal";
import { analytics } from "@/lib/analytics/mixpanel";
import { Check, Sparkles, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { PriceData } from "@/app/api/polar/price/route";

export function PricingCards() {
  const { isPro, isLoading: subLoading } = useSubscription();
  const { authenticated, isLoading: authLoading, user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [price, setPrice] = useState<PriceData | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);

  const isLoading = subLoading || authLoading;

  useEffect(() => {
    async function loadPrice() {
      try {
        const res = await fetch("/api/polar/price");
        if (res.ok) {
          const data = await res.json();
          setPrice(data);
        }
      } catch (error) {
        console.error("Failed to load price:", error);
      } finally {
        setPriceLoading(false);
      }
    }
    loadPrice();
  }, []);

  const handlePurchase = async () => {
    if (!authenticated) {
      setSignInOpen(true);
      return;
    }

    const productId = process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID;
    if (!productId) {
      toast.error("Payments not configured", {
        description: "NEXT_PUBLIC_POLAR_PRODUCT_ID is missing in .env",
      });
      return;
    }

    if (price?.id === "fallback") {
      toast.error("Payments not configured", {
        description: "Polar is not set up yet. Please add POLAR_ACCESS_TOKEN to .env",
      });
      return;
    }

    try {
      setIsCheckingOut(true);
      analytics.checkoutStarted({
        priceId: productId,
        amount: price?.amount || 0,
        currency: price?.currency || "USD",
      });

      // Build checkout URL with query parameters
      const params = new URLSearchParams({
        products: productId,
      });
      if (user?.email) {
        params.set("customerEmail", user.email);
      }
      if (user?.name) {
        params.set("customerName", user.name);
      }

      const checkoutUrl = `/api/polar/checkout?${params.toString()}`;

      await openPolarCheckout({
        checkoutUrl,
        theme: "dark",
        onSuccess: (data) => {
          const params = new URLSearchParams({ source: "polar" });
          if (data.orderId) params.set("order_id", data.orderId);
          if (data.customerId) params.set("customer_id", data.customerId);
          window.location.href = `/success?${params.toString()}`;
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      const message = error instanceof Error ? error.message : "Please try again later.";
      toast.error("Checkout failed", {
        description: message,
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <div className="max-w-md mx-auto">
        <Card className="p-8 relative border-primary ring-2 ring-primary/20">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              {price?.name || "Pro"}
            </h3>
            <p className="text-muted-foreground">
              {price?.description || "Lifetime access to all features"}
            </p>
          </div>

          <div className="mb-8">
            {priceLoading ? (
              <div className="h-12 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <span className="text-5xl font-bold">
                  {price ? formatPrice(price.amount, price.currency) : "$9.99"}
                </span>
                <span className="text-muted-foreground ml-2">one-time</span>
              </>
            )}
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span>All 14 premium map styles</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span>All devices (Desktop, Tablet, Ultra-wide)</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span>4K AI-upscaled wallpapers</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span>No watermarks</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span>Lifetime updates</span>
            </li>
          </ul>

          {isPro ? (
            <div className="space-y-3">
              <Button variant="outline" className="w-full h-12 text-lg" disabled>
                <Check className="w-5 h-5 mr-2" />
                Purchased
              </Button>
              <Link href="/app">
                <Button className="w-full" variant="secondary">
                  Open App
                </Button>
              </Link>
            </div>
          ) : (
            <Button
              className="w-full h-12 text-lg gap-2"
              onClick={handlePurchase}
              disabled={isCheckingOut || isLoading || priceLoading}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  {authenticated ? "Get Access" : "Sign In to Purchase"}
                  {price && authenticated ? ` - ${formatPrice(price.amount, price.currency)}` : ""}
                </>
              )}
            </Button>
          )}
        </Card>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            One-time payment
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Secure checkout
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Instant access
          </div>
        </div>
      </div>

      <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />
    </>
  );
}

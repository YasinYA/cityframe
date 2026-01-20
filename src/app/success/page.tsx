"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { analytics } from "@/lib/analytics/mixpanel";
import { Check, Map, Sparkles, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { LoadingLogo } from "@/components/ui/loading-logo";

function SuccessContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    async function verifyPayment() {
      // If coming from Paddle checkout
      if (source === "paddle") {
        try {
          // Update Pro status via API
          const res = await fetch("/api/paddle/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });

          if (res.ok) {
            setVerified(true);
            // Track purchase completed
            analytics.purchaseCompleted({
              priceId: "pro",
              amount: 0, // We don't have exact amount here
              currency: "usd",
            });
            // Celebrate with confetti
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
        } catch (error) {
          console.error("Verification error:", error);
        } finally {
          setVerifying(false);
        }
        return;
      }

      // No source or unrecognized source - just show success
      setVerified(true);
      setVerifying(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    verifyPayment();
  }, [source]);

  if (verifying) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 md:p-10 text-center rounded-2xl border-2 shadow-xl">
          <LoadingLogo size="lg" className="mb-4" />
          <h1 className="text-xl font-extrabold">Verifying your payment...</h1>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 md:p-10 text-center rounded-2xl border-2 shadow-xl">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
            <Check className="w-7 h-7 text-white" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">Welcome to Pro!</h1>
        <p className="text-muted-foreground mb-8 text-base md:text-lg">
          Your purchase is complete. You have lifetime access to all premium features.
        </p>

        {/* Features unlocked */}
        <div className="bg-muted/50 rounded-2xl p-5 mb-8 text-left border">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Features Unlocked
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-3 h-3 text-green-500" />
              </div>
              <span className="font-medium">All 14 premium map styles</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-3 h-3 text-green-500" />
              </div>
              <span className="font-medium">All device sizes</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-3 h-3 text-green-500" />
              </div>
              <span className="font-medium">No watermarks</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-3 h-3 text-green-500" />
              </div>
              <span className="font-medium">Priority generation</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-3 h-3 text-green-500" />
              </div>
              <span className="font-medium">Unlimited generations</span>
            </li>
          </ul>
        </div>

        <Link href="/">
          <Button className="w-full gap-2 h-14 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all" size="lg">
            <Map className="w-5 h-5" />
            Start Creating
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </Card>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 md:p-10 text-center rounded-2xl border-2 shadow-xl">
        <LoadingLogo size="lg" className="mb-4" />
        <h1 className="text-xl font-extrabold">Loading...</h1>
      </Card>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Map, Sparkles, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Celebrate with confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Welcome to Pro!</h1>
        <p className="text-muted-foreground mb-6">
          Your subscription is now active. You have access to all premium features.
        </p>

        {/* Features unlocked */}
        <div className="bg-secondary/50 rounded-lg p-4 mb-6 text-left">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Features Unlocked
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              All 6 premium map styles
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              All device sizes
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              No watermarks
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Priority generation
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Unlimited generations
            </li>
          </ul>
        </div>

        <Link href="/">
          <Button className="w-full gap-2" size="lg">
            <Map className="w-4 h-4" />
            Start Creating
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </Card>
    </main>
  );
}

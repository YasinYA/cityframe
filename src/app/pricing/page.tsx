import { Metadata } from "next";
import Link from "next/link";
import { PricingCards } from "@/components/pricing/PricingCards";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Pricing - CityFrame",
  description: "Get lifetime access to all styles, devices, and AI-upscaled 4K wallpapers.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center px-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.webp"
                alt="CityFrame"
                width={32}
                height={32}
              />
              <span className="font-semibold">CityFrame</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Get Pro Access
            </h1>
            <p className="text-muted-foreground">
              One payment. Lifetime access to all features.
            </p>
          </div>

          <PricingCards />

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-16">
            <h2 className="text-xl font-bold text-center mb-6">
              Questions
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-1">Is this a one-time payment?</h3>
                <p className="text-muted-foreground">
                  Yes. Pay once, own forever. No subscriptions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  All major credit cards via Paddle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Do I need an account?</h3>
                <p className="text-muted-foreground">
                  Yes. Sign in with your email to purchase and access the app.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">What&apos;s included?</h3>
                <p className="text-muted-foreground">
                  All 14 map styles, all device sizes, 4K AI-upscaled wallpapers, no watermarks, and lifetime updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { PricingCards } from "@/components/pricing/PricingCards";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Pricing - City Frame",
  description: "Get lifetime access to all styles, devices, and AI-upscaled 4K wallpapers.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-[60px] md:h-[70px] items-center px-4 md:px-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.webp"
                alt="City Frame"
                width={32}
                height={32}
                className="w-8 h-8 md:w-9 md:h-9"
              />
              <span className="font-extrabold text-lg md:text-xl tracking-tight">City Frame</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Get Pro Access
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              One payment. Lifetime access to all features.
            </p>
          </div>

          <PricingCards />

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-20">
            <h2 className="text-2xl font-extrabold text-center mb-8">
              Questions
            </h2>
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-muted/30 border hover:border-primary/20 transition-colors">
                <h3 className="font-bold mb-2">Is this a one-time payment?</h3>
                <p className="text-muted-foreground">
                  Yes. Pay once, own forever. No subscriptions.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-muted/30 border hover:border-primary/20 transition-colors">
                <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  All major credit cards via Paddle.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-muted/30 border hover:border-primary/20 transition-colors">
                <h3 className="font-bold mb-2">Do I need an account?</h3>
                <p className="text-muted-foreground">
                  Yes. Sign in with your email to purchase and access the app.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-muted/30 border hover:border-primary/20 transition-colors">
                <h3 className="font-bold mb-2">What&apos;s included?</h3>
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

import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Refund Policy - City Frame",
  description: "Refund and cancellation policy for City Frame purchases.",
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-background">
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

      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">Refund Policy</h1>
          <p className="text-muted-foreground mb-10 text-base md:text-lg">Last updated: January 2025</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">14-Day Money-Back Guarantee</h2>
              <p className="text-muted-foreground">
                City Frame offers a 14-day money-back guarantee on all City Frame Pro purchases.
                If you are not satisfied with your purchase for any reason, you can request a
                full refund within 14 days of your purchase date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">How to Request a Refund</h2>
              <p className="text-muted-foreground">
                To request a refund, please email info@cityframe.app with the email address
                associated with your purchase. Refunds are typically processed within 5-10
                business days and will be credited to your original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">After Your Refund</h2>
              <p className="text-muted-foreground">
                Once your refund is processed, your account will be returned to the free tier.
                You will retain access to free features and any wallpapers you have already
                downloaded.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Payment Processing</h2>
              <p className="text-muted-foreground">
                Our order process is conducted by our online reseller Paddle.com. Paddle.com
                is the Merchant of Record for all our orders and handles all refund processing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our refund policy, please contact City Frame
                at info@cityframe.app
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <div className="flex gap-6 text-sm text-muted-foreground font-medium">
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

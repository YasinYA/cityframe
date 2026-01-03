import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Refund Policy - CityFrame",
  description: "Refund and cancellation policy for CityFrame purchases.",
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-background">
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

      <section className="py-12 md:py-16">
        <div className="container px-4 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Our Commitment</h2>
              <p className="text-muted-foreground">
                We want you to be completely satisfied with your CityFrame purchase.
                If you&apos;re not happy with the Pro features, we offer a straightforward
                refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7-Day Money-Back Guarantee</h2>
              <p className="text-muted-foreground">
                If you&apos;re not satisfied with your Pro purchase for any reason, you can
                request a full refund within 7 days of your purchase date. No questions asked.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">How to Request a Refund</h2>
              <p className="text-muted-foreground mb-2">To request a refund:</p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                <li>Email us at support@cityframe.app</li>
                <li>Include the email address associated with your purchase</li>
                <li>Briefly let us know why you&apos;re requesting a refund (optional, but helps us improve)</li>
              </ol>
              <p className="text-muted-foreground mt-2">
                We&apos;ll process your refund within 5-10 business days. The refund will be
                credited to your original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">After the Refund</h2>
              <p className="text-muted-foreground">
                Once your refund is processed, your account will be downgraded to the free tier.
                You&apos;ll still have access to free features and any wallpapers you&apos;ve already
                downloaded.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Exceptions</h2>
              <p className="text-muted-foreground mb-2">Refunds may not be available if:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>More than 7 days have passed since your purchase</li>
                <li>You&apos;ve previously received a refund for CityFrame</li>
                <li>There&apos;s evidence of abuse or fraudulent activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Chargebacks</h2>
              <p className="text-muted-foreground">
                We encourage you to contact us directly for refunds rather than initiating
                a chargeback with your bank. Chargebacks incur fees and may result in your
                account being suspended.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                Have questions about our refund policy? Reach out to us at support@cityframe.app
                and we&apos;ll be happy to help.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

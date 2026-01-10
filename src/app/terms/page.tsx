import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Terms of Service - City Frame",
  description: "Terms and conditions for using City Frame wallpaper generator.",
};

export default function TermsPage() {
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
                alt="City Frame"
                width={32}
                height={32}
              />
              <span className="font-semibold">City Frame</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-12 md:py-16">
        <div className="container px-4 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. About City Frame</h2>
              <p className="text-muted-foreground">
                These Terms of Service (&quot;Terms&quot;) govern your use of City Frame, a service operated
                by City Frame. By accessing or using City Frame at cityframe.app, you agree to be bound
                by these Terms. If you do not agree to these Terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground">
                City Frame operates City Frame, a web-based application that allows users to generate
                custom city map wallpapers for various devices. We offer both free and paid tiers
                with different feature sets.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p className="text-muted-foreground">
                To access certain features, you may need to create an account using your email address.
                You are responsible for maintaining the confidentiality of your account and for all
                activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
              <p className="text-muted-foreground mb-2">You agree not to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Use the service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Resell or redistribute generated wallpapers commercially without permission</li>
                <li>Use automated tools to excessively access the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
              <p className="text-muted-foreground">
                Wallpapers generated through City Frame are for personal use. The underlying map data
                is sourced from third-party providers and subject to their respective licenses.
                City Frame retains rights to the application, design, and custom style configurations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Payment and Billing</h2>
              <p className="text-muted-foreground">
                Pro access is available as a one-time purchase. Our order process is conducted by our
                online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders.
                Paddle provides all customer service inquiries and handles returns. Prices are subject
                to change, but any changes will not affect existing purchases.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Refunds</h2>
              <p className="text-muted-foreground">
                We offer a 14-day money-back guarantee on all Pro purchases. If you are not satisfied
                for any reason, you may request a full refund within 14 days of purchase. Please see
                our <Link href="/refund" className="underline">Refund Policy</Link> for details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                City Frame is provided by City Frame &quot;as is&quot; without warranties of any kind.
                City Frame is not liable for any indirect, incidental, or consequential damages
                arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                City Frame may update these Terms from time to time. Continued use of the service
                after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms, please contact City Frame at info@cityframe.app
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link href="/refund" className="hover:underline">Refund Policy</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

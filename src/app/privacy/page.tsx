import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Privacy Policy - City Frame",
  description: "How City Frame collects, uses, and protects your data.",
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground mb-10 text-base md:text-lg">Last updated: January 2025</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-2">We collect the following types of information:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Email address:</strong> When you create an account or make a purchase</li>
                <li><strong>Payment information:</strong> Processed securely by Paddle (we do not store card details)</li>
                <li><strong>Usage data:</strong> Wallpaper generation history linked to your account</li>
                <li><strong>Session data:</strong> Anonymous session identifiers for non-logged-in users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-2">We use collected information to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Provide and maintain our service</li>
                <li>Process payments and grant access to Pro features</li>
                <li>Send transactional emails (purchase confirmations, OTP codes)</li>
                <li>Improve and optimize the service</li>
                <li>Prevent abuse and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Storage</h2>
              <p className="text-muted-foreground">
                Your data is stored securely on our servers. Generated wallpapers are stored
                temporarily and may be automatically deleted after a period of inactivity.
                We use industry-standard security measures to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
              <p className="text-muted-foreground mb-2">We use the following third-party services:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Paddle:</strong> Payment processing (Merchant of Record)</li>
                <li><strong>Resend:</strong> Email delivery</li>
                <li><strong>Map providers:</strong> Map tile data for wallpaper generation</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Each service has its own privacy policy governing their use of your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use essential cookies to maintain your session and remember your preferences.
                We do not use third-party tracking or advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
              <p className="text-muted-foreground mb-2">You have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your account information as long as your account is active.
                Generated wallpapers may be deleted after 30 days of inactivity.
                Payment records are retained as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of
                significant changes by email or through the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
              <p className="text-muted-foreground">
                For privacy-related questions or to exercise your rights, contact us at
                info@cityframe.app
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <div className="flex gap-6 text-sm text-muted-foreground font-medium">
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/license" className="hover:text-foreground transition-colors">License</Link>
              <Link href="/refund" className="hover:text-foreground transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

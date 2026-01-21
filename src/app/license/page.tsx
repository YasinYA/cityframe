import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "License - City Frame",
  description: "License terms for City Frame wallpapers. Learn what you can and cannot do with your generated wallpapers.",
};

export default function LicensePage() {
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">License</h1>
          <p className="text-muted-foreground mb-10 text-base md:text-lg">Personal Use License for City Frame Wallpapers</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            {/* License Overview */}
            <section className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-3 text-primary">Personal Use License</h2>
              <p className="text-muted-foreground">
                When you generate wallpapers using City Frame, you are granted a <strong>personal, non-exclusive,
                non-transferable license</strong> to use those wallpapers for personal, non-commercial purposes only.
                This license is granted to you upon generation of the wallpaper and remains valid indefinitely.
              </p>
            </section>

            {/* What You Can Do */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                What You Can Do
              </h2>
              <ul className="space-y-3">
                {[
                  "Use wallpapers on your personal devices (phones, tablets, computers, monitors)",
                  "Share wallpapers with friends and family for their personal use",
                  "Post wallpapers on your personal social media accounts",
                  "Use wallpapers as backgrounds for personal video calls",
                  "Print wallpapers for personal decoration in your home",
                  "Create multiple wallpapers for all your devices",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* What You Cannot Do */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                What You Cannot Do
              </h2>
              <ul className="space-y-3">
                {[
                  "Sell or resell wallpapers in any form",
                  "Use wallpapers for commercial projects or client work",
                  "Include wallpapers in products or merchandise for sale",
                  "Use wallpapers in marketing materials or advertisements",
                  "Distribute wallpapers on other wallpaper platforms or services",
                  "Claim ownership or copyright over the wallpapers",
                  "Use wallpapers in NFTs or blockchain-based projects",
                  "Sublicense, transfer, or assign your license to others",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Ownership */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Ownership & Attribution</h2>
              <p className="text-muted-foreground mb-4">
                City Frame retains all intellectual property rights to the application, design systems,
                style configurations, and the unique artistic rendering process used to create the wallpapers.
              </p>
              <p className="text-muted-foreground mb-4">
                The underlying map data is sourced from OpenStreetMap and other third-party providers,
                and is subject to their respective licenses. The artistic transformation and styling
                applied by City Frame creates a derivative work that is subject to this license.
              </p>
              <p className="text-muted-foreground">
                Attribution is not required but always appreciated. If you share your wallpapers online,
                a mention of City Frame helps support our work.
              </p>
            </section>

            {/* Commercial Licensing */}
            <section className="bg-muted/50 border-2 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-3">Need a Commercial License?</h2>
              <p className="text-muted-foreground mb-4">
                If you want to use City Frame wallpapers for commercial purposes, including client projects,
                merchandise, marketing materials, or any revenue-generating activity, please contact us
                for commercial licensing options.
              </p>
              <p className="text-muted-foreground">
                Contact us at <a href="mailto:info@cityframe.app" className="text-primary hover:underline font-medium">info@cityframe.app</a> to
                discuss commercial licensing terms and pricing.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-xl font-semibold mb-3">License Termination</h2>
              <p className="text-muted-foreground">
                Your license to use a wallpaper continues indefinitely, even if you stop using City Frame.
                However, City Frame reserves the right to terminate your license if you violate these terms.
                Upon termination, you must cease all use of the wallpapers and delete any copies in your possession.
              </p>
            </section>

            {/* Questions */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Questions?</h2>
              <p className="text-muted-foreground">
                If you have any questions about this license or need clarification on permitted uses,
                please contact us at <a href="mailto:info@cityframe.app" className="text-primary hover:underline font-medium">info@cityframe.app</a>.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <div className="flex gap-6 text-sm text-muted-foreground font-medium">
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/refund" className="hover:text-foreground transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

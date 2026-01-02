"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap } from "lucide-react";
import { PriceData } from "@/lib/stripe/config";
import { motion } from "framer-motion";

export function LandingPricing() {
  const [price, setPrice] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrice() {
      try {
        const res = await fetch("/api/stripe/price");
        if (res.ok) {
          const data = await res.json();
          setPrice(data);
        }
      } catch (error) {
        console.error("Failed to load price:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPrice();
  }, []);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const features = [
    "All 14 premium map styles",
    "All devices (4K Desktop, Ultra-wide)",
    "AI-upscaled 4K quality",
    "No watermarks",
    "Lifetime updates",
  ];

  return (
    <section id="pricing" className="py-16 px-4 bg-muted/30">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold mb-2">Simple pricing</h2>
          <p className="text-muted-foreground">
            One payment. Lifetime access.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="max-w-sm mx-auto p-6 border-primary/50 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-bold">{price?.name || "Pro"}</h3>
            </div>

            <div className="mb-6">
              {loading ? (
                <div className="h-10 w-20 bg-muted animate-pulse rounded" />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    {price ? formatPrice(price.amount, price.currency) : "$9.99"}
                  </span>
                  <span className="text-muted-foreground text-sm">one-time</span>
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Link href="/pricing">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full gap-2">
                  <Zap className="w-4 h-4" />
                  Get Access{price ? ` - ${formatPrice(price.amount, price.currency)}` : ""}
                </Button>
              </motion.div>
            </Link>
          </Card>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-green-500" />
            One-time payment
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-green-500" />
            Secure checkout
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-green-500" />
            Instant access
          </div>
        </motion.div>
      </div>
    </section>
  );
}

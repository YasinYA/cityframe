"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { PriceData } from "@/app/api/polar/price/route";

export function LandingPricing() {
  const [price, setPrice] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrice() {
      try {
        const res = await fetch("/api/polar/price");
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
    "21 premium map styles",
    "All devices — phones to ultra-wide",
    "AI-upscaled 4K resolution",
    "Bilingual labels (English + native)",
    "Smart crop focus for phones",
    "Edge fade & location tags",
    "No watermarks, ever",
    "Lifetime access & updates",
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold mb-3">One price. Yours forever.</h2>
          <p className="text-lg text-muted-foreground">
            A single payment for lifetime access. No subscriptions. No upsells.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="max-w-md mx-auto p-8 border-primary/50 shadow-xl bg-gradient-to-b from-card to-card/50">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold">{price?.name || "Pro"}</h3>
            </div>

            <div className="mb-8">
              {loading ? (
                <div className="h-12 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">
                    {price ? formatPrice(price.amount, price.currency) : "$9.99"}
                  </span>
                  <span className="text-muted-foreground">one-time</span>
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-8">
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
                  Get lifetime access{price ? ` - ${formatPrice(price.amount, price.currency)}` : ""}
                </Button>
              </motion.div>
            </Link>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Personal use license. See terms for details.
            </p>
          </Card>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 mt-10 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            One-time payment
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Secure checkout
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Instant access
          </div>
        </motion.div>
      </div>
    </section>
  );
}

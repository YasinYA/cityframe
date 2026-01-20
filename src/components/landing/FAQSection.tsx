"use client";

import { useState, memo } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, stagger } from "./animations";

const faqs: { q: string; a: React.ReactNode }[] = [
  { q: "What devices are supported?", a: "City Frame creates wallpapers for all devices — iPhones, Android phones, iPads, tablets, desktop monitors (4K), and ultra-wide displays." },
  { q: "How many wallpapers can I create?", a: "Unlimited. With Unlimited access, you can generate as many wallpapers as you want for any city in the world, in any style, for any device." },
  { q: "Is this a subscription?", a: "No. City Frame is a one-time purchase. Pay once, use forever. No recurring fees, no upsells." },
  { q: "Can I use wallpapers commercially?", a: "The standard license is for personal use only. For commercial use, such as client projects, merchandise, printing services, or marketing materials, please contact us for a commercial license." },
  { q: "What if I'm not satisfied?", a: "We offer a full refund within 14 days of purchase, no questions asked." },
];

// FAQ Section Component - memoized to prevent unnecessary re-renders
export const FAQSection = memo(function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-32 lg:py-40 px-4 md:px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="lg:sticky lg:top-32 text-center lg:text-left"
          >
            <motion.h2 variants={fadeInUp} className="text-[36px] sm:text-[44px] md:text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-4 md:mb-12 lg:mb-16 leading-[1.1]">
              Questions & answers
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base md:text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-6 md:mb-10">
              Everything you need to know about City Frame. Can&apos;t find what you&apos;re looking for?
            </motion.p>
            <motion.a
              variants={fadeInUp}
              href="mailto:support@cityframe.app"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm md:text-base"
            >
              support@cityframe.app
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-3 md:space-y-4"
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-background rounded-xl md:rounded-2xl border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-muted transition-colors"
                >
                  <span className="font-semibold text-sm md:text-lg pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 md:px-6 pb-4 md:pb-6 text-muted-foreground text-sm md:text-base leading-relaxed">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
});

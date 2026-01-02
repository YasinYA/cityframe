"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Sparkles, Monitor } from "lucide-react";
import { STYLE_CONFIGS } from "@/lib/map/styles";
import { LandingPricing } from "@/components/pricing/LandingPricing";
import { SignInModal } from "@/components/auth/SignInModal";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  const featuredStyles = STYLE_CONFIGS.slice(0, 4);
  const [signInOpen, setSignInOpen] = useState(false);
  const { authenticated, isLoading } = useAuth();

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
      >
        <div className="container flex h-14 items-center justify-between px-4 max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.webp"
              alt="CityFrame"
              width={32}
              height={32}
            />
            <span className="font-semibold">CityFrame</span>
          </Link>

          {!isLoading && (
            authenticated ? (
              <Link href="/app">
                <Button size="sm">
                  Open App
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setSignInOpen(true)}>
                Sign In
              </Button>
            )
          )}
        </div>
      </motion.header>

      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              >
                Your city.
                <br />
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Your wallpaper.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-muted-foreground mb-8 max-w-md"
              >
                Turn any location into stunning 4K wallpapers for all your devices. Powered by AI upscaling.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link href="/app">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Create Wallpaper
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="#pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Pricing
                  </Button>
                </a>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex gap-8 mt-10 pt-8 border-t"
              >
                <div>
                  <p className="text-2xl font-bold">{STYLE_CONFIGS.length}</p>
                  <p className="text-sm text-muted-foreground">Map styles</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Device sizes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">4K</p>
                  <p className="text-sm text-muted-foreground">Resolution</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="grid grid-cols-3 gap-3">
                {featuredStyles.slice(0, 3).map((style, i) => (
                  <motion.div
                    key={style.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                    className={`aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border ${
                      i === 1 ? "mt-6" : i === 2 ? "mt-3" : ""
                    }`}
                  >
                    <Image
                      src={`/styles/${style.id}.png`}
                      alt={style.name}
                      width={200}
                      height={356}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-center mb-12"
          >
            Three steps to your perfect wallpaper
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: "Pick a location", desc: "Search any city or navigate the map to find your spot" },
              { icon: Sparkles, title: "Choose a style", desc: `Select from ${STYLE_CONFIGS.length} unique map styles` },
              { icon: Monitor, title: "Download in 4K", desc: "Get AI-upscaled wallpapers for any device" },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                >
                  <step.icon className="w-5 h-5 text-primary" />
                </motion.div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles Preview */}
      <section id="styles" className="py-16 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold mb-2">Beautiful styles</h2>
            <p className="text-muted-foreground">
              From minimal to bold — find your aesthetic
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredStyles.map((style, i) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden border shadow-sm">
                  <Image
                    src={`/styles/${style.id}.png`}
                    alt={style.name}
                    width={150}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <p className="text-xs text-center mt-2 text-muted-foreground">
                  {style.name}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            +{STYLE_CONFIGS.length - featuredStyles.length} more in the app
          </motion.p>
        </div>
      </section>

      {/* Pricing */}
      <LandingPricing />

      {/* Final CTA */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="container max-w-2xl mx-auto text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            Ready to create?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start making beautiful wallpapers in seconds.
          </p>
          <Link href="/app">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="gap-2">
                Open App
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.webp"
              alt="CityFrame"
              width={24}
              height={24}
            />
            <span className="text-sm font-medium">CityFrame</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CityFrame
          </p>
        </div>
      </footer>

      <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />
    </main>
  );
}

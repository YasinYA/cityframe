"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ArrowRight, MapPin, Sparkles, Download, Image as ImageIcon, Monitor, Languages, Focus, Video, Home, X, Menu } from "lucide-react";
import { STYLE_CONFIGS } from "@/lib/map/styles";
import { motion, AnimatePresence } from "framer-motion";
import { analytics } from "@/lib/analytics/mixpanel";

// Import extracted components
import { HeroDeviceCarousel } from "./HeroDeviceCarousel";
import { DevicesSection } from "./DevicesSection";
import { CitySearchSection } from "./CitySearchSection";
import { FAQSection } from "./FAQSection";
import { fadeInUp, fadeInRight, stagger, scaleIn } from "./animations";

export default function PreLaunchPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const formStartedRef = useRef<Record<string, boolean>>({});

  const trackFormStarted = (location: string) => {
    if (!formStartedRef.current[location]) {
      formStartedRef.current[location] = true;
      analytics.waitlistFormStarted(location);
    }
  };

  const handleSubmit = async (e: React.FormEvent, location: string = "hero") => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
      analytics.waitlistSignupCompleted({ email, name: name || undefined, location });
      setName("");
      setEmail("");
    } catch (err) {
      setStatus("error");
      const errorMsg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMessage(errorMsg);
      analytics.waitlistSignupFailed({ error: errorMsg, location });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-[60px] md:h-[70px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.webp" alt="City Frame" width={32} height={32} className="w-8 h-8 md:w-9 md:h-9" />
            <span className="font-extrabold text-lg md:text-xl tracking-tight">City Frame</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#how-it-works" className="text-[15px] text-muted-foreground hover:text-foreground transition-colors font-medium">How it works</a>
            <a href="#features" className="text-[15px] text-muted-foreground hover:text-foreground transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-[15px] text-muted-foreground hover:text-foreground transition-colors font-medium">Pricing</a>
            <a href="#faq" className="text-[15px] text-muted-foreground hover:text-foreground transition-colors font-medium">FAQ</a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t bg-background/95 backdrop-blur-md"
            >
              <div className="px-4 py-4 space-y-1">
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  How it works
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  FAQ
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section className="pt-[90px] md:pt-[140px] pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6 md:mb-8">
                🚀 Launching Soon
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-[40px] sm:text-[48px] md:text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold leading-[1.1] tracking-tight mb-6 md:mb-12 lg:mb-16">
                <span className="block">Your city.</span>
                <span className="block mt-1 md:mt-2 lg:mt-4 text-primary">Your&nbsp;wallpaper.</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0 font-medium">
                Turn the place you love into a stunning 4K wallpaper — in seconds.
              </motion.p>

              <motion.div variants={fadeInUp}>
                {status === "success" ? (
                  <div className="flex items-center justify-center lg:justify-start gap-3 py-4 px-6 bg-green-50 text-green-600 rounded-xl w-fit mx-auto lg:mx-0">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">You&apos;re on the list!</span>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleSubmit(e, "hero")} className="flex flex-col gap-3 max-w-md mx-auto lg:mx-0">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => trackFormStarted("hero")}
                        className="h-14 text-base rounded-xl flex-1"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => trackFormStarted("hero")}
                        className="h-14 text-base rounded-xl flex-1"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-14 px-8 rounded-xl w-full"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        <Image src="/loading-logo.svg" alt="Loading" width={24} height={24} />
                      ) : (
                        "Get early access"
                      )}
                    </Button>
                  </form>
                )}
                {status === "error" && <p className="text-sm text-red-500 mt-3">{errorMessage}</p>}
                <p className="text-sm text-muted-foreground mt-4 font-medium">
                  Be the first to know when we launch. No spam, ever.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInRight}
              className="hidden lg:flex lg:items-center lg:justify-end"
            >
              <HeroDeviceCarousel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-muted/30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {[
              { value: STYLE_CONFIGS.length, label: "Map Styles" },
              { value: "6", label: "Device Sizes" },
              { value: "4K", label: "Resolution" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                <p className="text-[32px] sm:text-[44px] md:text-[56px] lg:text-[72px] font-extrabold text-primary leading-none">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-2 md:mt-3 uppercase tracking-wider md:tracking-widest font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Who's It For */}
      <section className="py-16 md:py-32 lg:py-40 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h2 className="text-[36px] sm:text-[44px] md:text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-6 md:mb-12 lg:mb-16 leading-[1.1]">
                Who&apos;s it for?
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                City Frame is for everyone who wants to carry a piece of a place they love.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="space-y-5"
            >
              {[
                { icon: MapPin, title: "Travelers & explorers", desc: "Turn your favorite destinations into lasting memories you see every day." },
                { icon: Monitor, title: "Locals & hometown fans", desc: "Show love for the city you call home with a wallpaper that represents you." },
                { icon: Sparkles, title: "Design enthusiasts", desc: "Elevate your devices with minimal, premium aesthetics that stand out." },
                { icon: Download, title: "Gift givers", desc: "Create a thoughtful, personalized gift for someone who loves a special place." },
                { icon: Video, title: "Content creators", desc: "Stand out with unique city-themed backgrounds for streams, videos, and thumbnails." },
                { icon: Home, title: "Real estate & Airbnb hosts", desc: "Showcase your city's vibe to guests and make your listing feel more local." },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  className="flex gap-5 p-6 rounded-2xl bg-background border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Devices Section */}
      <DevicesSection />

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-32 lg:py-40 px-4 md:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-10 md:mb-20"
          >
            <h2 className="text-[36px] sm:text-[44px] md:text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-4 md:mb-12 lg:mb-16 leading-[1.1]">How it works</h2>
            <p className="text-base md:text-xl text-muted-foreground font-medium">Three simple steps to your perfect wallpaper</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16"
          >
            {[
              { illustration: "/illustrations/step-location.svg", step: 1, title: "Find your place", desc: "Search for any city or drop a pin anywhere on the map" },
              { illustration: "/illustrations/step-style.svg", step: 2, title: "Pick a style", desc: "Choose from 21 beautiful premium map styles" },
              { illustration: "/illustrations/step-download.svg", step: 3, title: "Download", desc: "Get high-resolution wallpapers for all your devices" },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeInUp} className="text-center">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 flex items-center justify-center">
                  <Image
                    src={item.illustration}
                    alt={item.title}
                    width={128}
                    height={128}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
                <div className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary text-primary-foreground text-base md:text-lg font-bold mb-3 md:mb-5">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Search Your City */}
      <CitySearchSection />

      {/* Features */}
      <section id="features" className="py-16 md:py-32 lg:py-40 px-4 md:px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-start">
            {/* Left - Title (sticky) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="lg:sticky lg:top-32 text-center lg:text-left"
            >
              <motion.h2 variants={fadeInUp} className="text-[36px] sm:text-[44px] md:text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-6 md:mb-12 lg:mb-16 leading-[1.1]">
                Packed with features
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Everything you need to create the perfect wallpaper, built right in.
              </motion.p>
            </motion.div>

            {/* Right - Features stacked */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="space-y-4 md:space-y-5"
            >
              {[
                { title: "Bilingual labels", desc: "City names in English and native language", icon: Languages },
                { title: "Smart framing", desc: "AI-powered centering for every screen", icon: Focus },
                { title: "Edge fade effect", desc: "Cinematic vignette for a premium look", icon: Sparkles },
                { title: "Location tag", desc: "Optional city name and coordinates overlay", icon: MapPin },
                { title: "4K resolution", desc: "Crystal clear detail on any display", icon: ImageIcon },
                { title: "Instant download", desc: "Your wallpaper ready in seconds", icon: Download },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={fadeInUp}
                    whileHover={{ x: 8, transition: { duration: 0.2 } }}
                    className="flex gap-4 md:gap-8 p-5 md:p-10 bg-background rounded-2xl md:rounded-3xl border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 md:w-10 md:h-10 text-primary" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-lg md:text-2xl mb-1 md:mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-32 lg:py-40 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.h2 variants={fadeInUp} className="text-[36px] sm:text-[44px] md:text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-6 md:mb-12 lg:mb-16 leading-[1.1]">
                Simple pricing
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-10 leading-relaxed">
                No subscriptions. No hidden fees. Pay once, create unlimited wallpapers forever.
              </motion.p>
              <motion.div variants={stagger} className="space-y-3 md:space-y-5 hidden md:block">
                {[
                  "No monthly fees or renewals",
                  "Free updates included for life",
                  "14-day money-back guarantee",
                ].map((item) => (
                  <motion.div key={item} variants={fadeInUp} className="flex items-center gap-4 justify-center lg:justify-start">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </div>
                    <span className="text-foreground/80 font-medium text-base md:text-lg">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              whileHover={{ y: -4 }}
              className="p-6 md:p-10 rounded-2xl md:rounded-3xl border-2 border-primary bg-background shadow-2xl shadow-primary/10"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
                </div>
                <span className="text-xl md:text-2xl font-bold">Unlimited</span>
              </div>

              <div className="mb-6 md:mb-10">
                <span className="text-[48px] md:text-[64px] font-extrabold tracking-tight">$13.99</span>
                <span className="text-muted-foreground ml-2 md:ml-3 text-base md:text-xl font-medium">one-time</span>
              </div>

              <ul className="space-y-3 md:space-y-4 mb-6 md:mb-10">
                {[
                  "21 premium map styles",
                  "All device sizes supported",
                  "AI-upscaled 4K resolution",
                  "Bilingual labels",
                  "No watermarks",
                  "Lifetime access & updates",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 md:gap-4">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="w-full h-12 md:h-14 text-base md:text-lg rounded-xl"
                onClick={() => {
                  analytics.landingCtaClicked({ cta: "join_launch_list", location: "pricing" });
                  document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Join the launch list
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Button>

              <p className="text-xs md:text-sm text-muted-foreground text-center mt-4 md:mt-5 font-medium">
                Personal use license. See terms for details.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <section id="get-started" className="py-16 md:py-32 lg:py-40 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.h2 variants={fadeInUp} className="text-[36px] sm:text-[44px] md:text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-4 md:mb-12 lg:mb-16 leading-[1.1]">
                Join the first users
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-base md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Join the launch list today and be among the first to transform your favorite cities into stunning wallpapers.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInRight}
              className="bg-muted/30 p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl"
            >
              <h3 className="text-lg md:text-xl font-bold mb-2">Join the launch list</h3>
              <p className="text-muted-foreground text-sm md:text-base mb-4 md:mb-6">Be the first to know when we launch.</p>
              {status === "success" ? (
                <div className="flex items-center gap-3 py-3 md:py-4 px-4 md:px-6 bg-green-50 text-green-600 rounded-xl w-fit">
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-semibold text-sm md:text-base">You&apos;re on the list!</span>
                </div>
              ) : (
                <form onSubmit={(e) => handleSubmit(e, "footer_cta")} className="space-y-3 md:space-y-4">
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => trackFormStarted("footer_cta")}
                    className="h-12 md:h-14 text-sm md:text-base rounded-xl"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => trackFormStarted("footer_cta")}
                    className="h-12 md:h-14 text-sm md:text-base rounded-xl"
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 md:h-14 rounded-xl text-sm md:text-base"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <Image src="/loading-logo.svg" alt="Loading" width={24} height={24} />
                    ) : (
                      <>
                        Get Early Access
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}
              <p className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">No spam, ever. Unsubscribe anytime.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 md:px-6 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.webp" alt="City Frame" width={24} height={24} className="w-6 h-6 md:w-7 md:h-7" />
            <span className="font-extrabold text-base md:text-lg tracking-tight">City Frame</span>
          </Link>

          {/* Social Media Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/cityframeapp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.socialLinkClicked("x")}
              className="w-9 h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              aria-label="Follow us on X"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/cityframeapp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.socialLinkClicked("instagram")}
              className="w-9 h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://pinterest.com/cityframeapp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.socialLinkClicked("pinterest")}
              className="w-9 h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              aria-label="Follow us on Pinterest"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://reddit.com/r/cityframeapp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.socialLinkClicked("reddit")}
              className="w-9 h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              aria-label="Join us on Reddit"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12s12-5.372 12-12c0-6.627-5.373-12-12-12zm6.066 13.31c.028.225.042.453.042.683 0 3.483-4.054 6.307-9.054 6.307-5 0-9.054-2.824-9.054-6.307 0-.23.014-.458.043-.683a1.796 1.796 0 0 1-.726-1.447c0-.992.804-1.796 1.796-1.796.467 0 .893.178 1.213.47 1.195-.857 2.842-1.41 4.676-1.471l.893-4.203a.374.374 0 0 1 .444-.286l2.974.627a1.27 1.27 0 0 1 2.39.597 1.27 1.27 0 0 1-2.52.168l-2.643-.557-.794 3.74c1.795.074 3.403.627 4.573 1.471.32-.292.746-.47 1.213-.47.992 0 1.796.804 1.796 1.796 0 .593-.287 1.119-.726 1.447zM8.25 12.459c-.659 0-1.194.535-1.194 1.194s.535 1.194 1.194 1.194 1.194-.535 1.194-1.194-.535-1.194-1.194-1.194zm7.5 0c-.659 0-1.194.535-1.194 1.194s.535 1.194 1.194 1.194 1.194-.535 1.194-1.194-.535-1.194-1.194-1.194zm-6.428 4.027a.344.344 0 0 0-.055.484c.862 1.059 2.31 1.667 3.978 1.667h.002c1.668 0 3.116-.608 3.978-1.667a.344.344 0 0 0-.484-.484c-.715.68-1.912 1.07-3.244 1.07h-.002c-1.332 0-2.529-.39-3.244-1.07a.344.344 0 0 0-.43 0z" />
              </svg>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground font-medium">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/license" className="hover:text-foreground transition-colors">License</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/refund" className="hover:text-foreground transition-colors">Refunds</Link>
            <a href="mailto:support@cityframe.app" className="hover:text-foreground transition-colors">support@cityframe.app</a>
          </div>
          <span className="text-xs md:text-sm text-muted-foreground">&copy; {new Date().getFullYear()} City Frame</span>
        </div>
      </footer>
    </main>
  );
}

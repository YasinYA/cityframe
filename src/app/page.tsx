"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Sparkles, Monitor, Smartphone, Tablet, MonitorPlay, User, LogOut, Globe, Crop, Blend, Tag, Languages, Focus, Download, Image as ImageIcon } from "lucide-react";
import PreLaunchPage from "@/components/landing/PreLaunchPage";

// Set NEXT_PUBLIC_PRELAUNCH=true in .env to show pre-launch page
const IS_PRELAUNCH = process.env.NEXT_PUBLIC_PRELAUNCH === "true";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STYLE_CONFIGS } from "@/lib/map/styles";
import { LandingPricing } from "@/components/pricing/LandingPricing";
import { SignInModal } from "@/components/auth/SignInModal";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

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

// Step Illustrations for How it Works section (MetaMusic-inspired, large format)
const StepIllustration = ({ step }: { step: 1 | 2 | 3 }) => {
  if (step === 1) {
    // Map with location pin - finding your place
    return (
      <svg viewBox="0 0 200 160" className="w-full max-w-[200px] h-auto mx-auto">
        {/* Map base */}
        <rect x="20" y="20" width="160" height="120" rx="16" fill="#E8F4FD"/>
        {/* Map grid lines */}
        <path d="M40 60 L160 60" stroke="#0693E3" strokeWidth="1.5" opacity="0.2"/>
        <path d="M40 90 L160 90" stroke="#0693E3" strokeWidth="1.5" opacity="0.2"/>
        <path d="M40 120 L160 120" stroke="#0693E3" strokeWidth="1.5" opacity="0.2"/>
        <path d="M70 40 L70 130" stroke="#0693E3" strokeWidth="1.5" opacity="0.2"/>
        <path d="M100 40 L100 130" stroke="#0693E3" strokeWidth="1.5" opacity="0.2"/>
        <path d="M130 40 L130 130" stroke="#0693E3" strokeWidth="1.5" opacity="0.2"/>
        {/* Curved road */}
        <path d="M30 100 Q60 70 100 80 T170 60" stroke="#0693E3" strokeWidth="3" fill="none" opacity="0.4"/>
        {/* Location pin shadow */}
        <ellipse cx="100" cy="95" rx="20" ry="6" fill="#0693E3" opacity="0.2"/>
        {/* Location pin */}
        <path d="M100 30 C75 30 60 50 60 70 C60 90 100 110 100 110 C100 110 140 90 140 70 C140 50 125 30 100 30 Z" fill="#0693E3"/>
        <circle cx="100" cy="65" r="15" fill="white"/>
        <circle cx="100" cy="65" r="6" fill="#0693E3"/>
        {/* Decorative elements */}
        <circle cx="45" cy="45" r="4" fill="#0693E3" opacity="0.3"/>
        <circle cx="155" cy="110" r="5" fill="#0693E3" opacity="0.3"/>
        <circle cx="160" cy="45" r="3" fill="#0693E3" opacity="0.2"/>
      </svg>
    );
  }
  if (step === 2) {
    // Style palette - choosing your style
    return (
      <svg viewBox="0 0 200 160" className="w-full max-w-[200px] h-auto mx-auto">
        {/* Background card */}
        <rect x="20" y="40" width="80" height="100" rx="8" fill="#0693E3"/>
        {/* Middle card */}
        <rect x="45" y="30" width="80" height="100" rx="8" fill="#E8F4FD" stroke="#0693E3" strokeWidth="2"/>
        {/* Map lines on middle card */}
        <path d="M55 60 L115 60" stroke="#0693E3" strokeWidth="1" opacity="0.3"/>
        <path d="M55 80 L115 80" stroke="#0693E3" strokeWidth="1" opacity="0.3"/>
        <path d="M85 45 L85 115" stroke="#0693E3" strokeWidth="1" opacity="0.3"/>
        {/* Front card */}
        <rect x="70" y="20" width="80" height="100" rx="8" fill="white" stroke="#0693E3" strokeWidth="2"/>
        {/* Map lines on front card */}
        <path d="M80 50 L140 50" stroke="#0693E3" strokeWidth="1" opacity="0.4"/>
        <path d="M80 70 L140 70" stroke="#0693E3" strokeWidth="1" opacity="0.4"/>
        <path d="M80 90 L140 90" stroke="#0693E3" strokeWidth="1" opacity="0.4"/>
        <path d="M110 30 L110 110" stroke="#0693E3" strokeWidth="1" opacity="0.4"/>
        {/* Sparkles */}
        <g fill="#0693E3">
          <circle cx="165" cy="35" r="3"/>
          <circle cx="175" cy="45" r="2"/>
          <circle cx="160" cy="50" r="2"/>
        </g>
        {/* Color swatches */}
        <circle cx="170" cy="100" r="12" fill="#0693E3"/>
        <circle cx="170" cy="130" r="12" fill="#E8F4FD" stroke="#0693E3" strokeWidth="2"/>
        {/* Checkmark on selected */}
        <path d="M165 98 L168 102 L176 94" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // Download - getting your wallpapers
  return (
    <svg viewBox="0 0 200 160" className="w-full max-w-[200px] h-auto mx-auto">
      {/* Phone frame */}
      <rect x="30" y="15" width="60" height="110" rx="8" fill="#E8F4FD" stroke="#0693E3" strokeWidth="2"/>
      <rect x="38" y="28" width="44" height="75" rx="2" fill="#0693E3" opacity="0.3"/>
      <circle cx="60" cy="115" r="5" stroke="#0693E3" strokeWidth="2" fill="none"/>
      {/* Desktop frame */}
      <rect x="100" y="25" width="80" height="55" rx="4" fill="#E8F4FD" stroke="#0693E3" strokeWidth="2"/>
      <rect x="108" y="33" width="64" height="39" rx="2" fill="#0693E3" opacity="0.3"/>
      {/* Desktop stand */}
      <rect x="130" y="80" width="20" height="15" fill="#0693E3"/>
      <rect x="115" y="95" width="50" height="5" rx="2" fill="#0693E3"/>
      {/* Download arrow */}
      <circle cx="140" cy="120" r="20" fill="#0693E3"/>
      <path d="M140 110 L140 128" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <path d="M132 122 L140 132 L148 122" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Sparkle decorations */}
      <circle cx="55" cy="140" r="4" fill="#0693E3" opacity="0.3"/>
      <circle cx="175" cy="20" r="3" fill="#0693E3" opacity="0.3"/>
      <circle cx="25" cy="60" r="3" fill="#0693E3" opacity="0.2"/>
    </svg>
  );
};

interface DeviceConfig {
  id: string;
  label: string;
  styleIndex: number;
  aspect: string;
  width: string;
  isMonitor?: boolean;
}

const deviceCategories: Array<{
  id: string;
  label: string;
  icon: typeof Smartphone;
  devices: DeviceConfig[];
}> = [
  {
    id: "phones",
    label: "Phones",
    icon: Smartphone,
    devices: [
      { id: "iphone", label: "iPhone", styleIndex: 0, aspect: "aspect-[9/19.5]", width: "w-[100px] sm:w-[120px]" },
      { id: "android", label: "Android", styleIndex: 3, aspect: "aspect-[9/20]", width: "w-[95px] sm:w-[115px]" },
    ],
  },
  {
    id: "tablets",
    label: "Tablets",
    icon: Tablet,
    devices: [
      { id: "ipad", label: "iPad", styleIndex: 1, aspect: "aspect-[3/4]", width: "w-[140px] sm:w-[170px]" },
      { id: "landscape", label: "Landscape", styleIndex: 5, aspect: "aspect-[4/3]", width: "w-[170px] sm:w-[200px]" },
    ],
  },
  {
    id: "desktop",
    label: "Desktop",
    icon: Monitor,
    devices: [
      { id: "desktop", label: "Desktop 4K", styleIndex: 2, aspect: "aspect-[16/10]", width: "w-[260px] sm:w-[320px]", isMonitor: true },
    ],
  },
  {
    id: "ultrawide",
    label: "Ultra-wide",
    icon: MonitorPlay,
    devices: [
      { id: "ultrawide", label: "Ultra-wide", styleIndex: 4, aspect: "aspect-[21/9]", width: "w-[300px] sm:w-[380px]", isMonitor: true },
    ],
  },
];

export default function LandingPage() {
  // Show pre-launch page if env var is set
  if (IS_PRELAUNCH) {
    return <PreLaunchPage />;
  }

  const featuredStyles = STYLE_CONFIGS.slice(0, 4);
  const [signInOpen, setSignInOpen] = useState(false);
  const { authenticated, isLoading, user, signOut } = useAuth();
  const [activeCategory, setActiveCategory] = useState(0);

  // Cycle through device categories
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % deviceCategories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
      >
        <div className="max-w-6xl mx-auto px-6 h-[70px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.webp"
              alt="City Frame"
              width={36}
              height={36}
            />
            <span className="font-extrabold text-xl tracking-tight">City Frame</span>
          </Link>

          {!isLoading && (
            authenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/app">
                  <Button size="lg" className="rounded-xl">
                    Open App
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="hidden sm:inline text-sm max-w-[120px] truncate">
                        {user?.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                      {user?.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button size="lg" className="rounded-xl" onClick={() => setSignInOpen(true)}>
                Sign In
              </Button>
            )
          )}
        </div>
      </motion.header>

      {/* Hero */}
      <section className="pt-[140px] pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold leading-[1.1] tracking-tight mb-12 lg:mb-16"
              >
                <span className="block">Your city.</span>
                <span className="block mt-2 lg:mt-4 text-primary">Your&nbsp;wallpaper.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-lg font-medium"
              >
                Turn any location into stunning 4K wallpapers. Bilingual labels, smart cropping, and cinematic effects — all in one click.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link href="/app">
                  <Button size="lg" className="w-full sm:w-auto gap-2 h-14 px-8 rounded-xl">
                    Create Wallpaper
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="#pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-xl">
                    View Pricing
                  </Button>
                </a>
              </motion.div>
            </motion.div>

            {/* Right - Device Mockups Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex flex-col items-center"
            >
              {/* Device Display Area */}
              <div className="relative h-[280px] sm:h-[320px] w-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={deviceCategories[activeCategory].id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-4 sm:gap-6 items-end justify-center"
                  >
                    {deviceCategories[activeCategory].devices.map((device, i) => (
                      <motion.div
                        key={device.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                        >
                          {device.isMonitor ? (
                            // Monitor style frame
                            <div>
                              <div className="bg-zinc-800 rounded-lg p-1 shadow-2xl">
                                <div className={`${device.width} ${device.aspect} rounded-sm overflow-hidden relative bg-black`}>
                                  <Image
                                    src={`/styles/${STYLE_CONFIGS[device.styleIndex].id}.png`}
                                    alt={`${device.label} wallpaper`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                              <div className="mx-auto w-12 h-3 bg-zinc-700 rounded-b" />
                              <div className="mx-auto w-20 h-1 bg-zinc-600 rounded-full" />
                            </div>
                          ) : (
                            // Phone/tablet style frame
                            <div className={`${device.width} rounded-[1.5rem] overflow-hidden bg-black p-1 shadow-2xl border border-zinc-700`}>
                              <div className={`${device.aspect} rounded-[1.25rem] overflow-hidden relative bg-black`}>
                                <Image
                                  src={`/styles/${STYLE_CONFIGS[device.styleIndex].id}.png`}
                                  alt={`${device.label} wallpaper`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </motion.div>
                        <p className="text-xs text-muted-foreground mt-3 font-medium">{device.label}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Category Indicators */}
              <div className="flex items-center gap-2 mt-6">
                {deviceCategories.map((category, i) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(i)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeCategory === i
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                          : "bg-background text-muted-foreground border hover:border-primary/30 hover:shadow-sm"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-muted/30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: STYLE_CONFIGS.length, label: "Map Styles" },
              { value: "6", label: "Device Sizes" },
              { value: "4K", label: "Resolution" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <p className="text-[56px] lg:text-[72px] font-extrabold text-primary leading-none">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-3 uppercase tracking-widest font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 lg:py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-12 lg:mb-16 leading-[1.1]">How it works</h2>
            <p className="text-xl text-muted-foreground font-medium">Three simple steps to your perfect wallpaper</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-16"
          >
            {[
              { step: 1 as const, title: "Find your place", desc: "Search for any city or drop a pin anywhere on the map" },
              { step: 2 as const, title: "Pick a style", desc: `Choose from ${STYLE_CONFIGS.length} beautiful premium map styles` },
              { step: 3 as const, title: "Download", desc: "Get high-resolution wallpapers for all your devices" },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeUp} className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mb-8"
                >
                  <StepIllustration step={item.step} />
                </motion.div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg font-bold mb-5">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 lg:py-40 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left - Title (sticky) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="lg:sticky lg:top-32"
            >
              <motion.h2 variants={fadeUp} className="text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-12 lg:mb-16 leading-[1.1]">
                Packed with features
              </motion.h2>
              <motion.p variants={fadeUp} className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Everything you need to create the perfect wallpaper, built right in.
              </motion.p>
            </motion.div>

            {/* Right - Features stacked */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="space-y-5"
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
                    variants={fadeUp}
                    whileHover={{ x: 8, transition: { duration: 0.2 } }}
                    className="flex gap-8 p-10 bg-background rounded-3xl border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-2xl mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Styles Preview */}
      <section id="styles" className="py-32 lg:py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-12 lg:mb-16 leading-[1.1]">Popular styles</h2>
            <p className="text-xl text-muted-foreground font-medium">The looks people love most</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {featuredStyles.map((style) => (
              <motion.div
                key={style.id}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border group-hover:border-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-300">
                  <Image
                    src={`/styles/${style.id}.png`}
                    alt={style.name}
                    width={200}
                    height={267}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center mt-4 font-semibold">{style.name}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center text-muted-foreground mt-12 font-medium"
          >
            +{STYLE_CONFIGS.length - featuredStyles.length} more styles included with Unlimited
          </motion.p>
        </div>
      </section>

      {/* Pricing */}
      <LandingPricing />

      {/* Final CTA */}
      <section className="py-32 lg:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-12 lg:mb-16 leading-[1.1]">
                Ready to get started?
              </motion.h2>
              <motion.p variants={fadeUp} className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Transform your favorite cities into stunning wallpapers. From Dubai to Tokyo, New York to Paris — make it yours.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="bg-muted/30 p-8 lg:p-10 rounded-3xl"
            >
              <h3 className="text-xl font-bold mb-2">Create your first wallpaper</h3>
              <p className="text-muted-foreground mb-6">No account required to get started.</p>
              <Link href="/app">
                <Button size="lg" className="w-full h-14 rounded-xl">
                  Open App
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.webp" alt="City Frame" width={28} height={28} />
            <span className="font-extrabold text-lg tracking-tight">City Frame</span>
          </Link>
          <div className="flex items-center gap-8 text-sm text-muted-foreground font-medium">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/refund" className="hover:text-foreground transition-colors">Refunds</Link>
            <a href="mailto:support@cityframe.app" className="hover:text-foreground transition-colors">support@cityframe.app</a>
          </div>
          <span className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} City Frame</span>
        </div>
      </footer>

      <SignInModal open={signInOpen} onOpenChange={setSignInOpen} redirectTo="/pricing" />
    </main>
  );
}

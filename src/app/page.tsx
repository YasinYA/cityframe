"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Sparkles, Monitor, Smartphone, Tablet, MonitorPlay, User, LogOut } from "lucide-react";
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
              <div className="flex items-center gap-3">
                <Link href="/app">
                  <Button size="sm">
                    Open App
                    <ArrowRight className="w-4 h-4 ml-1" />
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
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-sm text-muted-foreground">Device sizes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">4K</p>
                  <p className="text-sm text-muted-foreground">Resolution</p>
                </div>
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        activeCategory === i
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
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

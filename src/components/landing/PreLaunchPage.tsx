"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, ArrowRight, Smartphone, Tablet, Monitor, MonitorPlay, MapPin, Sparkles, Languages, Focus, Download, Image as ImageIcon } from "lucide-react";
import { STYLE_CONFIGS } from "@/lib/map/styles";
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from "framer-motion";

// Animation variants
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Device carousel configuration
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

// Hero Device Carousel Component
const HeroDeviceCarousel = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % deviceCategories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      {/* Device Display Area */}
      <div className="relative h-[280px] sm:h-[320px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={deviceCategories[activeCategory].id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex gap-4 sm:gap-6 items-center justify-center"
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
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                >
                  {device.isMonitor ? (
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
    </div>
  );
};

// Devices Section with Horizontal Scroll
const DevicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["90%", "-70%"]);

  const devices = [
    {
      type: "phone" as const,
      title: "Phone",
      desc: "Perfect for iPhone and Android. Optimized for OLED displays with true blacks and vibrant colors.",
      resolution: "1170 × 2532"
    },
    {
      type: "tablet" as const,
      title: "Tablet",
      desc: "Beautiful on iPad and Android tablets. Crisp details that shine on larger screens.",
      resolution: "2048 × 2732"
    },
    {
      type: "desktop" as const,
      title: "Desktop",
      desc: "Stunning 4K resolution for monitors and laptops. Every street and detail visible.",
      resolution: "3840 × 2160"
    },
    {
      type: "ultrawide" as const,
      title: "Ultra-wide",
      desc: "Panoramic perfection for ultra-wide monitors. Immersive cityscapes that wrap around.",
      resolution: "5120 × 1440"
    },
  ];

  return (
    <section ref={sectionRef} className="py-32 lg:py-40 overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-24 lg:mb-32 xl:mb-40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center"
        >
          <motion.h2 variants={fadeInUp} className="text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-12 lg:mb-16 leading-[1.1]">
            <span className="block">Every&nbsp;device,</span>
            <span className="block mt-2 lg:mt-4">covered</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            One click generates wallpapers for all your screens. No need to resize or crop manually — we handle it all automatically.
          </motion.p>
        </motion.div>
      </div>

      {/* Horizontal Scrolling Cards */}
      <div className="relative">
        <motion.div
          style={{ x }}
          className="flex gap-6 pl-6 lg:pl-[calc((100vw-1280px)/2+24px)]"
        >
          {devices.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="w-[320px] lg:w-[380px] flex-shrink-0 p-8 rounded-3xl bg-background border hover:border-primary/30 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="text-primary text-sm font-bold mb-6">0{index + 1}</div>
              <div className="mb-8 h-32 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.type === "phone" && <Smartphone className="w-8 h-8 text-primary" />}
                  {item.type === "tablet" && <Tablet className="w-8 h-8 text-primary" />}
                  {item.type === "desktop" && <Monitor className="w-8 h-8 text-primary" />}
                  {item.type === "ultrawide" && <MonitorPlay className="w-8 h-8 text-primary" />}
                </div>
              </div>
              <h3 className="font-bold text-2xl mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{item.desc}</p>
              <div className="text-sm text-primary font-semibold">{item.resolution}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const faqs: { q: string; a: React.ReactNode }[] = [
  { q: "What devices are supported?", a: "City Frame creates wallpapers for all devices — iPhones, Android phones, iPads, tablets, desktop monitors (4K), and ultra-wide displays." },
  { q: "How many wallpapers can I create?", a: "Unlimited. With Unlimited access, you can generate as many wallpapers as you want for any city in the world, in any style, for any device." },
  { q: "Is this a subscription?", a: "No. City Frame is a one-time purchase. Pay once, use forever. No recurring fees, no upsells." },
  { q: "Can I use wallpapers commercially?", a: "The standard license is for personal use only. For commercial use, such as client projects, merchandise, or marketing materials, please contact us for a commercial license." },
  { q: "What if I'm not satisfied?", a: "We offer a full refund within 14 days of purchase, no questions asked." },
];

export default function PreLaunchPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const featuredStyles = STYLE_CONFIGS.slice(0, 4);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-6 h-[70px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.webp" alt="City Frame" width={36} height={36} />
            <span className="font-extrabold text-xl tracking-tight">City Frame</span>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <a href="#how-it-works" className="text-[15px] text-muted-foreground hover:text-foreground transition-colors font-medium">How it works</a>
            <a href="#features" className="text-[15px] text-muted-foreground hover:text-foreground transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-[15px] text-muted-foreground hover:text-foreground transition-colors font-medium">Pricing</a>
          </div>
          <Button size="lg" className="rounded-xl">
            Join Waitlist
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-[140px] pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeInUp} className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-8">
                Launching Soon
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold leading-[1.1] tracking-tight mb-12 lg:mb-16">
                <span className="block">Your city.</span>
                <span className="block mt-2 lg:mt-4 text-primary whitespace-nowrap">Your&nbsp;wallpaper.</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-lg font-medium">
                Turn the place you love into a stunning 4K wallpaper — in seconds.
              </motion.p>

              <motion.div variants={fadeInUp}>
                {status === "success" ? (
                  <div className="flex items-center gap-3 py-4 px-6 bg-green-50 text-green-600 rounded-xl w-fit">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">You&apos;re on the list!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 text-base rounded-xl flex-1"
                      required
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="h-14 px-8 rounded-xl"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        <Image src="/loading-logo.svg" alt="Loading" width={24} height={24} />
                      ) : (
                        "Get Started"
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
              <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                <p className="text-[56px] lg:text-[72px] font-extrabold text-primary leading-none">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-3 uppercase tracking-widest font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Who's It For */}
      <section className="py-32 lg:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-12 lg:mb-16 leading-[1.1]">
                Who&apos;s it for?
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
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
      <section id="how-it-works" className="py-32 lg:py-40 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
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
              { icon: MapPin, step: 1, title: "Find your place", desc: "Search for any city or drop a pin anywhere on the map" },
              { icon: Sparkles, step: 2, title: "Pick a style", desc: "Choose from 21 beautiful premium map styles" },
              { icon: Download, step: 3, title: "Download", desc: "Get high-resolution wallpapers for all your devices" },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeInUp} className="text-center">
                <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }} className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
                  <item.icon className="w-10 h-10 text-primary" />
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

      {/* Styles Preview */}
      <section className="py-32 lg:py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
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
                variants={scaleIn}
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
            variants={fadeIn}
            className="text-center text-muted-foreground mt-12 font-medium"
          >
            +{STYLE_CONFIGS.length - featuredStyles.length} more styles included with Unlimited
          </motion.p>
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
              <motion.h2 variants={fadeInUp} className="text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-12 lg:mb-16 leading-[1.1]">
                Packed with features
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
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
                    variants={fadeInUp}
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

      {/* Pricing */}
      <section id="pricing" className="py-32 lg:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.h2 variants={fadeInUp} className="text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-12 lg:mb-16 leading-[1.1]">
                Simple pricing
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl lg:text-2xl text-muted-foreground mb-10 leading-relaxed">
                No subscriptions. No hidden fees. Pay once, create unlimited wallpapers forever.
              </motion.p>
              <motion.div variants={stagger} className="space-y-5">
                {[
                  "No monthly fees or renewals",
                  "Free updates included for life",
                  "14-day money-back guarantee",
                ].map((item) => (
                  <motion.div key={item} variants={fadeInUp} className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground/80 font-medium text-lg">{item}</span>
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
              className="p-10 rounded-3xl border-2 border-primary bg-background shadow-2xl shadow-primary/10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">Unlimited</span>
              </div>

              <div className="mb-10">
                <span className="text-[64px] font-extrabold tracking-tight">$9.99</span>
                <span className="text-muted-foreground ml-3 text-xl font-medium">one-time</span>
              </div>

              <ul className="space-y-4 mb-10">
                {[
                  "21 premium map styles",
                  "All device sizes supported",
                  "AI-upscaled 4K resolution",
                  "Bilingual labels",
                  "No watermarks",
                  "Lifetime access & updates",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="w-full h-14 text-lg rounded-xl"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Join Waitlist
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-sm text-muted-foreground text-center mt-5 font-medium">
                Personal use license. See terms for details.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 lg:py-40 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="lg:sticky lg:top-32"
            >
              <motion.h2 variants={fadeInUp} className="text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-12 lg:mb-16 leading-[1.1]">
                Questions & answers
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-10">
                Everything you need to know about City Frame. Can&apos;t find what you&apos;re looking for?
              </motion.p>
              <motion.a
                variants={fadeInUp}
                href="mailto:support@cityframe.app"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
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
              className="space-y-4"
            >
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="bg-background rounded-2xl border overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-muted transition-colors"
                  >
                    <span className="font-semibold text-lg pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

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
              <motion.h2 variants={fadeInUp} className="text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-12 lg:mb-16 leading-[1.1]">
                Ready to get started?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Join the waitlist today and be among the first to transform your favorite cities into stunning wallpapers.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInRight}
              className="bg-muted/30 p-8 lg:p-10 rounded-3xl"
            >
              <h3 className="text-xl font-bold mb-2">Join the waitlist</h3>
              <p className="text-muted-foreground mb-6">Be the first to know when we launch.</p>
              {status === "success" ? (
                <div className="flex items-center gap-3 py-4 px-6 bg-green-50 text-green-600 rounded-xl w-fit">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">You&apos;re on the list!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 text-base rounded-xl"
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 rounded-xl"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <Image src="/loading-logo.svg" alt="Loading" width={24} height={24} />
                    ) : (
                      <>
                        Get Early Access
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}
              <p className="text-sm text-muted-foreground mt-4">No spam, ever. Unsubscribe anytime.</p>
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
    </main>
  );
}

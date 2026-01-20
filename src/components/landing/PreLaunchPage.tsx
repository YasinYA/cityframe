"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, ArrowRight, Smartphone, Tablet, Monitor, MonitorPlay, MapPin, Sparkles, Languages, Focus, Download, Image as ImageIcon, Video, Home, Search, X, Menu } from "lucide-react";
import { STYLE_CONFIGS } from "@/lib/map/styles";
import { searchCities, getCityOgStyle, getCityBySlug, type City } from "@/lib/cities";

// Hand-picked popular cities for the landing page
const FEATURED_CITY_SLUGS = [
  "new-york",
  "paris",
  "tokyo",
  "london",
  "dubai",
  "barcelona",
  "singapore",
  "sydney",
  "rome",
  "los-angeles",
  "amsterdam",
  "hong-kong",
];
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
    <section ref={sectionRef} className="py-16 md:py-32 lg:py-40 overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-24 lg:mb-32 xl:mb-40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center"
        >
          <motion.h2 variants={fadeInUp} className="text-[36px] sm:text-[44px] md:text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-4 md:mb-12 lg:mb-16 leading-[1.1]">
            <span className="block">Every&nbsp;device,</span>
            <span className="block mt-1 md:mt-2 lg:mt-4">covered</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-base md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2">
            One click generates wallpapers for all your screens. No need to resize or crop manually — we handle it all automatically.
          </motion.p>
        </motion.div>
      </div>

      {/* Horizontal Scrolling Cards */}
      <div className="relative">
        <motion.div
          style={{ x }}
          className="flex gap-4 md:gap-6 pl-4 md:pl-6 lg:pl-[calc((100vw-1280px)/2+24px)]"
        >
          {devices.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="w-[260px] md:w-[320px] lg:w-[380px] flex-shrink-0 p-5 md:p-8 rounded-2xl md:rounded-3xl bg-background border hover:border-primary/30 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="text-primary text-xs md:text-sm font-bold mb-4 md:mb-6">0{index + 1}</div>
              <div className="mb-6 md:mb-8 h-24 md:h-32 flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.type === "phone" && <Smartphone className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
                  {item.type === "tablet" && <Tablet className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
                  {item.type === "desktop" && <Monitor className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
                  {item.type === "ultrawide" && <MonitorPlay className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
                </div>
              </div>
              <h3 className="font-bold text-lg md:text-2xl mb-2 md:mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4 md:mb-6">{item.desc}</p>
              <div className="text-xs md:text-sm text-primary font-semibold">{item.resolution}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// City Search Section Component
const CitySearchSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const popularCities = FEATURED_CITY_SLUGS.map(slug => getCityBySlug(slug)).filter((city): city is City => city !== undefined);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setSearchResults(searchCities(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const clearSelection = () => {
    setSelectedCity(null);
  };

  const getCityStyle = (citySlug: string) => {
    const styleId = getCityOgStyle(citySlug) || "midnight-gold";
    const styleConfig = STYLE_CONFIGS.find(s => s.id === styleId);
    return {
      id: styleId,
      name: styleConfig?.name || "Midnight Gold"
    };
  };

  return (
    <section className="py-16 md:py-32 lg:py-48 px-4 md:px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-8 md:mb-12"
        >
          <motion.p
            variants={fadeInUp}
            className="text-primary font-semibold text-base md:text-lg mb-4 md:mb-6 tracking-wide"
          >
            Try it now
          </motion.p>
          <h2 className="text-[32px] sm:text-[40px] md:text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-4 md:mb-8 leading-[1.05]">
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Search your city
            </span>
          </h2>
          <p className="text-base md:text-xl lg:text-2xl text-muted-foreground font-medium max-w-xl mx-auto px-2">
            Find the place you love and preview your wallpaper instantly
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative mb-8 md:mb-12"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl md:rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 md:w-6 h-5 md:h-6 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for any city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full h-14 md:h-20 pl-12 md:pl-16 pr-4 md:pr-8 text-base md:text-xl rounded-xl md:rounded-2xl border-2 bg-background shadow-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-3 bg-background border-2 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                {searchResults.map((city) => (
                  <button
                    key={city.slug}
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-6 py-5 text-left hover:bg-primary/5 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-bold text-lg">{city.name}</span>
                      <span className="text-muted-foreground ml-3">{city.country}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Popular Cities */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-10 md:mb-16"
        >
          <p className="text-xs md:text-sm text-muted-foreground text-center mb-4 md:mb-8 font-semibold uppercase tracking-widest">Popular destinations</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {popularCities.map((city) => (
              <motion.button
                key={city.slug}
                variants={fadeInUp}
                onClick={() => handleCitySelect(city)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 md:px-6 py-2 md:py-3 rounded-full border-2 bg-background hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 transition-all font-semibold text-sm md:text-base"
              >
                {city.name}
              </motion.button>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-xs md:text-sm mt-6 md:mt-8">
            Don&apos;t see your city? We&apos;re adding more every week! 🌍
          </p>
        </motion.div>

        {/* Inline Preview */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-background to-muted/50 rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-12 relative border-2 shadow-2xl">
                {/* Close button */}
                <button
                  onClick={clearSelection}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background border-2 flex items-center justify-center hover:bg-muted hover:border-primary/30 transition-all"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
                  {/* Left column - Title + Preview Image */}
                  <div className="flex flex-col items-center md:items-start">
                    <div className="mb-4 md:mb-8 text-center md:text-left">
                      <p className="text-primary font-semibold text-xs md:text-sm uppercase tracking-widest mb-1 md:mb-2">Preview</p>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold">{selectedCity.name}</h3>
                      <p className="text-muted-foreground text-base md:text-lg">{selectedCity.country}</p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="aspect-[3/4] w-[200px] md:w-[240px] lg:max-w-[280px] rounded-xl md:rounded-2xl overflow-hidden border-2 shadow-2xl shadow-primary/10 relative group"
                    >
                      <Image
                        src={`/styles/${getCityStyle(selectedCity.slug).id}.png`}
                        alt={`${selectedCity.name} wallpaper preview`}
                        width={280}
                        height={373}
                        className="w-full h-full object-cover"
                      />
                      {/* Style badge */}
                      <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4">
                        <div className="bg-background/90 backdrop-blur-sm rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 border shadow-lg">
                          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mb-0.5 md:mb-1">Matched style</p>
                          <p className="font-bold text-xs md:text-sm">{getCityStyle(selectedCity.slug).name}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right column - City Info & CTA */}
                  <div className="text-center md:text-left md:pt-16">
                    <p className="text-muted-foreground text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                      {selectedCity.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Link href={`/city/${selectedCity.slug}`}>
                        <Button size="lg" className="h-14 md:h-16 px-8 md:px-10 rounded-xl text-base md:text-lg w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                          Explore more
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                    <p className="text-muted-foreground mt-4 md:mt-6 font-medium text-sm md:text-base">
                      <span className="text-primary font-bold">{STYLE_CONFIGS.length}</span> styles available
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const faqs: { q: string; a: React.ReactNode }[] = [
  { q: "What devices are supported?", a: "City Frame creates wallpapers for all devices — iPhones, Android phones, iPads, tablets, desktop monitors (4K), and ultra-wide displays." },
  { q: "How many wallpapers can I create?", a: "Unlimited. With Unlimited access, you can generate as many wallpapers as you want for any city in the world, in any style, for any device." },
  { q: "Is this a subscription?", a: "No. City Frame is a one-time purchase. Pay once, use forever. No recurring fees, no upsells." },
  { q: "Can I use wallpapers commercially?", a: "The standard license is for personal use only. For commercial use, such as client projects, merchandise, printing services, or marketing materials, please contact us for a commercial license." },
  { q: "What if I'm not satisfied?", a: "We offer a full refund within 14 days of purchase, no questions asked." },
];

export default function PreLaunchPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
      setName("");
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
                Launching Soon 🚀
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
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto lg:mx-0">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-14 text-base rounded-xl flex-1"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
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
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 md:h-14 text-sm md:text-base rounded-xl"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground font-medium">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
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

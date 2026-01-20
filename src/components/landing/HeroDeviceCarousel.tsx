"use client";

import { useState, useEffect, memo } from "react";
import Image from "next/image";
import { Smartphone, Tablet, Monitor, MonitorPlay } from "lucide-react";
import { STYLE_CONFIGS } from "@/lib/map/styles";
import { motion, AnimatePresence } from "framer-motion";

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

// Hero Device Carousel Component - memoized to prevent unnecessary re-renders
export const HeroDeviceCarousel = memo(function HeroDeviceCarousel() {
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
});

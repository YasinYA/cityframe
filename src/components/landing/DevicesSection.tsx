"use client";

import { useRef, memo, useState, useEffect } from "react";
import { Smartphone, Tablet, Monitor, MonitorPlay } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeInUp, stagger } from "./animations";

// Devices Section with Horizontal Scroll - memoized to prevent unnecessary re-renders
export const DevicesSection = memo(function DevicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        {/* Mobile: Manual horizontal scroll */}
        {isMobile ? (
          <div className="flex gap-4 pl-4 pr-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
            {devices.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-[260px] flex-shrink-0 p-5 rounded-2xl bg-background border snap-center"
              >
                <div className="text-primary text-xs font-bold mb-4">0{index + 1}</div>
                <div className="mb-6 h-24 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {item.type === "phone" && <Smartphone className="w-6 h-6 text-primary" />}
                    {item.type === "tablet" && <Tablet className="w-6 h-6 text-primary" />}
                    {item.type === "desktop" && <Monitor className="w-6 h-6 text-primary" />}
                    {item.type === "ultrawide" && <MonitorPlay className="w-6 h-6 text-primary" />}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.desc}</p>
                <div className="text-xs text-primary font-semibold">{item.resolution}</div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Desktop: Scroll-based animation */
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
                <p className="text-muted-foreground text-base leading-relaxed mb-6">{item.desc}</p>
                <div className="text-sm text-primary font-semibold">{item.resolution}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
});

"use client";

import { useRef, memo } from "react";
import { Smartphone, Tablet, Monitor, MonitorPlay } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeInUp, stagger } from "./animations";

// Devices Section with Horizontal Scroll - memoized to prevent unnecessary re-renders
export const DevicesSection = memo(function DevicesSection() {
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
});

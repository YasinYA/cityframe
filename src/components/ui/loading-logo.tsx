"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LoadingLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizes = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
};

export function LoadingLogo({ size = "md", className, text }: LoadingLogoProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className={cn(sizes[size])}>
        {/* Using img tag directly to preserve SVG animations */}
        <img
          src="/loading-logo.svg"
          alt="Loading"
          className="w-full h-full"
        />
      </div>
      {text && (
        <p className="text-muted-foreground font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
}

"use client";

import { X, MapPin } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function CityNameCard() {
  const { cityName, showCityCard, setShowCityCard } = useAppStore();

  if (!showCityCard || !cityName) return null;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
      <div className="group relative">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />

        {/* Main card */}
        <div className="relative bg-background/80 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4">
          {/* Location icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
            <MapPin className="w-5 h-5" />
          </div>

          {/* City name */}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Location
            </span>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {cityName}
            </h1>
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowCityCard(false)}
            className="ml-2 p-2 rounded-full hover:bg-white/10 transition-all duration-200 text-muted-foreground hover:text-foreground hover:scale-110"
            aria-label="Hide city name"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

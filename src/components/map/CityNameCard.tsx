"use client";

import { MapPin } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getStyleConfig, getRoadColors } from "@/lib/map/styles";

export function CityNameCard() {
  const { cityName, showCityCard, selectedStyle } = useAppStore();

  if (!showCityCard || !cityName) return null;

  // Get theme colors
  const themeConfig = getStyleConfig(selectedStyle);
  const themeBackground = themeConfig?.map?.background || "#000000";
  const themeAccent = themeConfig?.map?.roads
    ? getRoadColors(themeConfig.map.roads).motorway
    : "#ffffff";

  // Determine if background is light or dark
  const hex = themeBackground.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const isLightTheme = luminance > 0.5;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
      <div
        className="px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg"
        style={{
          backgroundColor: isLightTheme ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${isLightTheme ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.15)"}`,
        }}
      >
        {/* Location icon */}
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full"
          style={{
            backgroundColor: isLightTheme ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.1)",
          }}
        >
          <MapPin
            className="w-4 h-4"
            style={{ color: themeAccent }}
          />
        </div>

        {/* City name */}
        <span
          className="text-xl font-semibold tracking-wide"
          style={{
            color: isLightTheme ? "#1a1a1a" : "#ffffff",
          }}
        >
          {cityName}
        </span>
      </div>
    </div>
  );
}

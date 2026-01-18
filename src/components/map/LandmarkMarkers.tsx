"use client";

import { Marker } from "react-map-gl/maplibre";
import { useMemo } from "react";
import { findNearbyLandmarks, Landmark } from "@/lib/landmarks";
import { getStyleConfig, getRoadColors } from "@/lib/map/styles";

interface LandmarkMarkersProps {
  lat: number;
  lng: number;
  zoom: number;
  styleId: string;
}

export function LandmarkMarkers({ lat, lng, zoom, styleId }: LandmarkMarkersProps) {
  // Find landmarks near the current view
  const landmarks = useMemo(() => {
    // Adjust search radius based on zoom level
    const radiusKm = zoom < 8 ? 200 : zoom < 10 ? 100 : zoom < 12 ? 50 : 25;
    return findNearbyLandmarks(lat, lng, radiusKm);
  }, [lat, lng, zoom]);

  // Get theme colors for styling landmarks
  const themeConfig = getStyleConfig(styleId);
  const accentColor = useMemo(() => {
    if (!themeConfig?.map?.roads) return "#333333";
    const roadColors = getRoadColors(themeConfig.map.roads);
    return roadColors.motorway || roadColors.primary || "#333333";
  }, [themeConfig]);

  const backgroundColor = themeConfig?.map?.background || "#ffffff";

  // Calculate marker size based on zoom
  const baseSize = useMemo(() => {
    if (zoom < 10) return 24;
    if (zoom < 12) return 32;
    if (zoom < 14) return 48;
    return 64;
  }, [zoom]);

  if (landmarks.length === 0) return null;

  return (
    <>
      {landmarks.map((landmark) => {
        const size = baseSize * (landmark.scale || 1);
        return (
          <Marker
            key={landmark.id}
            latitude={landmark.lat}
            longitude={landmark.lng}
            anchor="bottom"
          >
            <LandmarkSilhouette
              landmark={landmark}
              size={size}
              color={accentColor}
              backgroundColor={backgroundColor}
            />
          </Marker>
        );
      })}
    </>
  );
}

interface LandmarkSilhouetteProps {
  landmark: Landmark;
  size: number;
  color: string;
  backgroundColor: string;
}

function LandmarkSilhouette({ landmark, size, color, backgroundColor }: LandmarkSilhouetteProps) {
  // Determine if we need light or dark outline based on background
  const isLightBg = isLightColor(backgroundColor);
  const outlineColor = isLightBg ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.5)";
  const shadowColor = isLightBg ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.6)";

  return (
    <div
      className="landmark-marker transition-all duration-300 hover:scale-110 cursor-pointer"
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 3px 6px ${shadowColor})`,
      }}
      title={landmark.name}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{
          overflow: "visible",
        }}
      >
        {/* White/light outline for visibility on any background */}
        <path
          d={landmark.svgPath}
          fill={outlineColor}
          stroke={outlineColor}
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Main silhouette fill */}
        <path
          d={landmark.svgPath}
          fill={color}
          stroke={color}
          strokeWidth="0.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// Helper to determine if a color is light or dark
function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

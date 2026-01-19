"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MapGL, { NavigationControl, MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { CitySearch } from "./CitySearch";
import { CityNameCard } from "./CityNameCard";
import { MapControls } from "./MapControls";
import { useAppStore } from "@/lib/store";
import { getStyleById, getStyleConfig } from "@/lib/map/styles";
import { applyStyleToMap, setLabelsVisibility } from "@/lib/map/palettes";
import { MapLocation } from "@/types";
import { useAuth } from "@/hooks/useAuth";

// No API key required with OpenFreeMap!

export default function MapViewClient() {
  const mapRef = useRef<MapRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { location, setLocation, selectedStyle, showLabels, toggleLabels, setMapInstance, showLocationTag, toggleLocationTag, showVignette, toggleVignette, vignetteSize, setVignetteSize } = useAppStore();
  const { authenticated } = useAuth();
  const showLabelsRef = useRef(showLabels);

  // Keep ref in sync with state
  useEffect(() => {
    showLabelsRef.current = showLabels;
  }, [showLabels]);
  const [showGrid, setShowGrid] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: location.lng,
    latitude: location.lat,
    zoom: location.zoom,
    bearing: location.bearing,
    pitch: location.pitch,
  });

  const styleConfig = getStyleById(selectedStyle);
  const themeConfig = getStyleConfig(selectedStyle);
  // Default to Positron (open-source light style)
  const mapStyle = styleConfig?.mapStyle || "https://tiles.openfreemap.org/styles/positron";

  // Get theme background color for vignette (default to black for unknown themes)
  const vignetteColor = themeConfig?.map?.background || "#000000";

  const onMove = useCallback((evt: { viewState: typeof viewState }) => {
    setViewState(evt.viewState);
  }, []);

  const onMoveEnd = useCallback(() => {
    const newLocation: MapLocation = {
      lat: viewState.latitude,
      lng: viewState.longitude,
      zoom: viewState.zoom,
      bearing: viewState.bearing,
      pitch: viewState.pitch,
    };
    setLocation(newLocation);
  }, [viewState, setLocation]);

  const handleCitySelect = (lat: number, lng: number) => {
    mapRef.current?.flyTo({
      center: [lng, lat],
      zoom: 13,
      duration: 2000,
    });
  };

  const handleZoomChange = (zoom: number) => {
    setViewState((prev) => ({ ...prev, zoom }));
  };

  const handleBearingChange = (bearing: number) => {
    setViewState((prev) => ({ ...prev, bearing }));
  };

  const handlePitchChange = (pitch: number) => {
    setViewState((prev) => ({ ...prev, pitch }));
  };

  // Toggle 3D building layer visibility
  const toggle3DBuildings = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const newState = !show3D;
    setShow3D(newState);

    // Set 3D building layer visibility
    try {
      if (map.getLayer("building-3d")) {
        map.setLayoutProperty("building-3d", "visibility", newState ? "visible" : "none");
      }
    } catch {
      // Layer might not exist
    }
  }, [show3D]);

  // Sync viewState with location from store
  useEffect(() => {
    setViewState({
      longitude: location.lng,
      latitude: location.lat,
      zoom: location.zoom,
      bearing: location.bearing,
      pitch: location.pitch,
    });
  }, [location.lat, location.lng, location.zoom, location.bearing, location.pitch]);

  // Apply labels when showLabels changes
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !map.isStyleLoaded()) return;

    setLabelsVisibility(map, showLabels);
  }, [showLabels]);

  // Keep show3D ref in sync
  const show3DRef = useRef(show3D);
  useEffect(() => {
    show3DRef.current = show3D;
  }, [show3D]);

  // Apply labels and 3D visibility when style changes
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Use idle event which fires after style is fully loaded and rendered
    const handleIdle = () => {
      setLabelsVisibility(map, showLabelsRef.current);
      // Sync 3D building visibility
      try {
        if (map.getLayer("building-3d")) {
          map.setLayoutProperty("building-3d", "visibility", show3DRef.current ? "visible" : "none");
        }
      } catch {
        // Layer might not exist
      }
      map.off("idle", handleIdle);
    };

    map.on("idle", handleIdle);

    return () => {
      map.off("idle", handleIdle);
    };
  }, [selectedStyle]);

  // Handle map load
  const handleMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Register map instance with store for canvas capture
    setMapInstance(map);

    // Apply initial style and labels
    applyStyleToMap(map, selectedStyle);
    setLabelsVisibility(map, showLabelsRef.current);

    // Hide 3D buildings by default
    try {
      if (map.getLayer("building-3d")) {
        map.setLayoutProperty("building-3d", "visibility", "none");
      }
    } catch {
      // Layer might not exist
    }
  }, [selectedStyle, setMapInstance]);

  // Cleanup map instance on unmount
  useEffect(() => {
    return () => {
      setMapInstance(null);
    };
  }, [setMapInstance]);

  // Screenshot protection for non-authenticated users
  useEffect(() => {
    if (authenticated) return;

    const container = containerRef.current;
    if (!container) return;

    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent drag start
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    container.addEventListener("contextmenu", handleContextMenu);
    container.addEventListener("dragstart", handleDragStart);

    return () => {
      container.removeEventListener("contextmenu", handleContextMenu);
      container.removeEventListener("dragstart", handleDragStart);
    };
  }, [authenticated]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={!authenticated ? {
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      } : undefined}
    >
      <MapGL
        ref={mapRef}
        {...viewState}
        onMove={onMove}
        onMoveEnd={onMoveEnd}
        onLoad={handleMapLoad}
        mapStyle={mapStyle}
        style={{ position: "absolute", inset: 0 }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
      </MapGL>

      {/* City Name Card */}
      <CityNameCard />

      {/* City Search */}
      <div className="absolute top-4 left-4 z-10">
        <CitySearch onSelect={handleCitySelect} />
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 left-4 z-10">
        <MapControls
          zoom={viewState.zoom}
          bearing={viewState.bearing}
          pitch={viewState.pitch}
          showGrid={showGrid}
          showLabels={showLabels}
          showVignette={showVignette}
          show3D={show3D}
          showLocationTag={showLocationTag}
          vignetteSize={vignetteSize}
          onZoomChange={handleZoomChange}
          onBearingChange={handleBearingChange}
          onPitchChange={handlePitchChange}
          onGridToggle={() => setShowGrid(!showGrid)}
          onLabelsToggle={toggleLabels}
          onVignetteToggle={toggleVignette}
          on3DToggle={toggle3DBuildings}
          onLocationTagToggle={toggleLocationTag}
          onVignetteSizeChange={setVignetteSize}
        />
      </div>

      {/* Grid Overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none z-5">
          <svg className="w-full h-full">
            <defs>
              <pattern
                id="grid"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 100 0 L 0 0 0 100"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      {/* Vignette/Edge Fade Overlay - uses theme background color */}
      {showVignette && (
        <div className="absolute inset-0 pointer-events-none z-5">
          {/* Top fade */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: `${vignetteSize}%`,
              background: `linear-gradient(to bottom, ${vignetteColor} 0%, transparent 100%)`
            }}
          />
          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${vignetteSize}%`,
              background: `linear-gradient(to top, ${vignetteColor} 0%, transparent 100%)`
            }}
          />
          {/* Left fade */}
          <div
            className="absolute top-0 bottom-0 left-0"
            style={{
              width: `${vignetteSize * 0.67}%`,
              background: `linear-gradient(to right, ${vignetteColor}CC 0%, transparent 100%)`
            }}
          />
          {/* Right fade */}
          <div
            className="absolute top-0 bottom-0 right-0"
            style={{
              width: `${vignetteSize * 0.67}%`,
              background: `linear-gradient(to left, ${vignetteColor}CC 0%, transparent 100%)`
            }}
          />
          {/* Corner vignettes for smoother effect */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, transparent ${100 - vignetteSize * 2}%, ${vignetteColor}80 100%)`
            }}
          />
        </div>
      )}

      {/* Watermark Overlay for non-authenticated users */}
      {!authenticated && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {/* Repeating diagonal watermark pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 100px,
                rgba(128, 128, 128, 0.03) 100px,
                rgba(128, 128, 128, 0.03) 200px
              )`,
            }}
          />
          {/* Center watermark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="text-6xl font-bold text-foreground/[0.07] tracking-widest select-none"
              style={{
                transform: "rotate(-30deg)",
                textShadow: "0 0 20px rgba(0,0,0,0.1)",
              }}
            >
              PREVIEW
            </div>
          </div>
          {/* Multiple smaller watermarks */}
          <div className="absolute top-[15%] left-[10%]">
            <div
              className="text-2xl font-semibold text-foreground/[0.05] tracking-wider select-none"
              style={{ transform: "rotate(-30deg)" }}
            >
              cityframe.app
            </div>
          </div>
          <div className="absolute top-[15%] right-[10%]">
            <div
              className="text-2xl font-semibold text-foreground/[0.05] tracking-wider select-none"
              style={{ transform: "rotate(-30deg)" }}
            >
              cityframe.app
            </div>
          </div>
          <div className="absolute bottom-[20%] left-[15%]">
            <div
              className="text-2xl font-semibold text-foreground/[0.05] tracking-wider select-none"
              style={{ transform: "rotate(-30deg)" }}
            >
              cityframe.app
            </div>
          </div>
          <div className="absolute bottom-[20%] right-[15%]">
            <div
              className="text-2xl font-semibold text-foreground/[0.05] tracking-wider select-none"
              style={{ transform: "rotate(-30deg)" }}
            >
              cityframe.app
            </div>
          </div>
        </div>
      )}

      {/* Location Info */}
      <div className="absolute bottom-4 right-4 z-10 bg-background/90 backdrop-blur-md px-3 py-2 rounded-lg text-xs font-mono shadow-lg border">
        <span className="text-muted-foreground">
          {viewState.latitude.toFixed(4)}, {viewState.longitude.toFixed(4)}
        </span>
        <span className="text-muted-foreground/50 mx-2">|</span>
        <span className="text-foreground font-medium">z{viewState.zoom.toFixed(1)}</span>
      </div>
    </div>
  );
}

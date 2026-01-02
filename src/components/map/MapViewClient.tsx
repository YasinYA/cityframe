"use client";

import { useCallback, useEffect, useRef, useState, forwardRef } from "react";
import MapGL, { NavigationControl, MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { CitySearch } from "./CitySearch";
import { CityNameCard } from "./CityNameCard";
import { MapControls } from "./MapControls";
import { useAppStore } from "@/lib/store";
import { getStyleById } from "@/lib/map/styles";
import { applyStyleToMap, setLabelsVisibility } from "@/lib/map/palettes";
import { MapLocation } from "@/types";

// No API key required with OpenFreeMap!

export default function MapViewClient() {
  const mapRef = useRef<MapRef>(null);
  const { location, setLocation, selectedStyle, showLabels, toggleLabels, setMapInstance } = useAppStore();
  const showLabelsRef = useRef(showLabels);

  // Keep ref in sync with state
  useEffect(() => {
    showLabelsRef.current = showLabels;
  }, [showLabels]);
  const [showGrid, setShowGrid] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: location.lng,
    latitude: location.lat,
    zoom: location.zoom,
    bearing: location.bearing,
    pitch: location.pitch,
  });

  const styleConfig = getStyleById(selectedStyle);
  // Default to Positron (open-source light style)
  const mapStyle = styleConfig?.mapStyle || "https://tiles.openfreemap.org/styles/positron";

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

  // Apply labels when style changes
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Use idle event which fires after style is fully loaded and rendered
    const handleIdle = () => {
      setLabelsVisibility(map, showLabelsRef.current);
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
  }, [selectedStyle, setMapInstance]);

  // Cleanup map instance on unmount
  useEffect(() => {
    return () => {
      setMapInstance(null);
    };
  }, [setMapInstance]);

  return (
    <div className="relative w-full h-full">
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
          onZoomChange={handleZoomChange}
          onBearingChange={handleBearingChange}
          onPitchChange={handlePitchChange}
          onGridToggle={() => setShowGrid(!showGrid)}
          onLabelsToggle={toggleLabels}
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

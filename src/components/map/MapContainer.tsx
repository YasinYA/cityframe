"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Map, { NavigationControl, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapLocation } from "@/types";
import { useAppStore } from "@/lib/store";
import { getStyleById } from "@/lib/map/styles";
import { applyStyleToMap, setLabelsVisibility } from "@/lib/map/palettes";

// No API key required with OpenFreeMap!

export function MapContainer() {
  const mapRef = useRef<MapRef>(null);
  const { location, setLocation, selectedStyle, showLabels } = useAppStore();
  const showLabelsRef = useRef(showLabels);

  // Keep ref in sync with state
  useEffect(() => {
    showLabelsRef.current = showLabels;
  }, [showLabels]);
  const [viewState, setViewState] = useState({
    longitude: location.lng,
    latitude: location.lat,
    zoom: location.zoom,
    bearing: location.bearing,
    pitch: location.pitch,
  });

  const styleConfig = getStyleById(selectedStyle);
  // Default to OpenFreeMap Positron (no API key required!)
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

  // Listen for external events
  useEffect(() => {
    const handleFlyTo = (e: CustomEvent) => {
      const { lat, lng, zoom = 13 } = e.detail;
      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom,
        duration: 2000,
      });
    };

    const handleZoomChange = (e: CustomEvent) => {
      setViewState((prev) => ({ ...prev, zoom: e.detail.zoom }));
    };

    const handleBearingChange = (e: CustomEvent) => {
      setViewState((prev) => ({ ...prev, bearing: e.detail.bearing }));
    };

    const handlePitchChange = (e: CustomEvent) => {
      setViewState((prev) => ({ ...prev, pitch: e.detail.pitch }));
    };

    window.addEventListener("mapFlyTo", handleFlyTo as EventListener);
    window.addEventListener("mapZoomChange", handleZoomChange as EventListener);
    window.addEventListener("mapBearingChange", handleBearingChange as EventListener);
    window.addEventListener("mapPitchChange", handlePitchChange as EventListener);

    return () => {
      window.removeEventListener("mapFlyTo", handleFlyTo as EventListener);
      window.removeEventListener("mapZoomChange", handleZoomChange as EventListener);
      window.removeEventListener("mapBearingChange", handleBearingChange as EventListener);
      window.removeEventListener("mapPitchChange", handlePitchChange as EventListener);
    };
  }, []);

  // Update viewState when location changes from store
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

    // Apply initial style and labels
    applyStyleToMap(map, selectedStyle);
    setLabelsVisibility(map, showLabelsRef.current);
  }, [selectedStyle]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={onMove}
        onMoveEnd={onMoveEnd}
        onLoad={handleMapLoad}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
}

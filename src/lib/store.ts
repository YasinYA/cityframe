import { create } from "zustand";
import { MapLocation, DeviceType, JobStatus, AIOptions, CropPosition } from "@/types";
import type { Map as MapLibreMap } from "maplibre-gl";
import { getStyleConfig, getRoadColors } from "@/lib/map/styles";

interface AppState {
  // Map state
  location: MapLocation;
  setLocation: (location: MapLocation) => void;

  // Map reference for canvas capture
  mapInstance: MapLibreMap | null;
  setMapInstance: (map: MapLibreMap | null) => void;

  // City name state
  cityName: string | null;
  setCityName: (name: string | null) => void;
  showCityCard: boolean;
  setShowCityCard: (show: boolean) => void;

  // Style state
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;

  // Labels state
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  toggleLabels: () => void;

  // Location tag state (for wallpaper export)
  showLocationTag: boolean;
  setShowLocationTag: (show: boolean) => void;
  toggleLocationTag: () => void;

  // Vignette/fade state (for wallpaper export)
  showVignette: boolean;
  vignetteSize: number;
  setShowVignette: (show: boolean) => void;
  toggleVignette: () => void;
  setVignetteSize: (size: number) => void;

  // Device state
  selectedDevices: DeviceType[];
  toggleDevice: (device: DeviceType) => void;
  setSelectedDevices: (devices: DeviceType[]) => void;

  // Crop position for portrait devices
  cropPosition: CropPosition;
  setCropPosition: (position: CropPosition) => void;

  // AI options
  aiOptions: AIOptions;
  setAIOptions: (options: Partial<AIOptions>) => void;
  toggleAI: () => void;

  // Generation state
  currentJobId: string | null;
  jobStatus: JobStatus | null;
  jobProgress: number;
  generatedImages: Array<{ device: string; url: string }>;
  error: string | null;

  // Actions
  captureMapCanvas: () => Promise<string | null>;
  startGeneration: () => Promise<void>;
  checkStatus: () => Promise<void>;
  getDownloadLinks: () => Promise<void>;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial map state (New York City)
  location: {
    lat: 40.7128,
    lng: -74.006,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  },
  setLocation: (location) => set({ location }),

  // Map instance for canvas capture
  mapInstance: null,
  setMapInstance: (map) => set({ mapInstance: map }),

  // City name state
  cityName: "New York",
  setCityName: (name) => set({ cityName: name, showCityCard: name !== null }),
  showCityCard: true,
  setShowCityCard: (show) => set({ showCityCard: show }),

  // Initial style - Midnight Gold
  selectedStyle: "midnight-gold",
  setSelectedStyle: (style) => set({ selectedStyle: style }),

  // Labels - off by default for clean wallpaper look
  showLabels: false,
  setShowLabels: (show) => set({ showLabels: show }),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),

  // Location tag - off by default
  showLocationTag: false,
  setShowLocationTag: (show) => set({ showLocationTag: show }),
  toggleLocationTag: () => set((state) => ({ showLocationTag: !state.showLocationTag })),

  // Vignette/fade - off by default
  showVignette: false,
  vignetteSize: 15,
  setShowVignette: (show) => set({ showVignette: show }),
  toggleVignette: () => set((state) => ({ showVignette: !state.showVignette })),
  setVignetteSize: (size) => set({ vignetteSize: size }),

  // Initial devices
  selectedDevices: ["iphone"],
  toggleDevice: (device) =>
    set((state) => {
      if (state.selectedDevices.includes(device)) {
        // Don't allow deselecting the last device
        if (state.selectedDevices.length === 1) return state;
        return {
          selectedDevices: state.selectedDevices.filter((d) => d !== device),
        };
      }
      return { selectedDevices: [...state.selectedDevices, device] };
    }),
  setSelectedDevices: (devices) => set({ selectedDevices: devices }),

  // Crop position - center by default
  cropPosition: "center",
  setCropPosition: (position) => set({ cropPosition: position }),

  // AI options
  aiOptions: {
    enabled: false,
    upscale: true,
    upscaleFactor: 2,
    enhanceStyle: false,
  },
  setAIOptions: (options) =>
    set((state) => ({
      aiOptions: { ...state.aiOptions, ...options },
    })),
  toggleAI: () =>
    set((state) => ({
      aiOptions: { ...state.aiOptions, enabled: !state.aiOptions.enabled },
    })),

  // Generation state
  currentJobId: null,
  jobStatus: null,
  jobProgress: 0,
  generatedImages: [],
  error: null,

  // Capture map canvas as base64 PNG
  captureMapCanvas: async () => {
    const { mapInstance, showLocationTag, cityName, selectedStyle, showVignette, vignetteSize } = get();
    console.log("Capturing map, instance:", !!mapInstance, "showLocationTag:", showLocationTag, "cityName:", cityName, "showVignette:", showVignette);

    if (!mapInstance) {
      console.error("Map instance not available");
      return null;
    }

    // Wait for map to be fully loaded and idle
    await new Promise<void>((resolve) => {
      const checkReady = () => {
        if (mapInstance.isStyleLoaded() && mapInstance.areTilesLoaded()) {
          resolve();
        } else {
          mapInstance.once("idle", checkReady);
        }
      };
      checkReady();
    });

    // Capture during render frame to get content before WebGL clears buffer
    return new Promise<string>((resolve) => {
      mapInstance.once("render", () => {
        const mapCanvas = mapInstance.getCanvas();

        // Get theme config for overlays
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

        // Check if we need to composite any overlays
        const needsComposite = showVignette || (showLocationTag && cityName);
        console.log("needsComposite:", needsComposite, "will draw location tag:", showLocationTag && !!cityName);

        if (needsComposite) {
          // Create a new canvas to composite map + overlays
          const compositeCanvas = document.createElement("canvas");
          compositeCanvas.width = mapCanvas.width;
          compositeCanvas.height = mapCanvas.height;
          const ctx = compositeCanvas.getContext("2d")!;

          // Draw map
          ctx.drawImage(mapCanvas, 0, 0);

          // Draw vignette/fade effect (matching CSS from MapViewClient)
          if (showVignette) {
            const w = compositeCanvas.width;
            const h = compositeCanvas.height;
            const fadeHeight = h * (vignetteSize / 100);
            const fadeWidth = w * (vignetteSize * 0.67 / 100);

            // Use theme color with zero alpha for transparent stops (avoids black blending)
            const themeTransparent = themeBackground + "00";

            // Top fade - matches CSS: linear-gradient(to bottom, color 0%, transparent 100%)
            const topGradient = ctx.createLinearGradient(0, 0, 0, fadeHeight);
            topGradient.addColorStop(0, themeBackground);
            topGradient.addColorStop(1, themeTransparent);
            ctx.fillStyle = topGradient;
            ctx.fillRect(0, 0, w, fadeHeight);

            // Bottom fade - matches CSS: linear-gradient(to top, color 0%, transparent 100%)
            const bottomGradient = ctx.createLinearGradient(0, h, 0, h - fadeHeight);
            bottomGradient.addColorStop(0, themeBackground);
            bottomGradient.addColorStop(1, themeTransparent);
            ctx.fillStyle = bottomGradient;
            ctx.fillRect(0, h - fadeHeight, w, fadeHeight);

            // Left fade - matches CSS: linear-gradient(to right, colorCC 0%, transparent 100%)
            const leftGradient = ctx.createLinearGradient(0, 0, fadeWidth, 0);
            leftGradient.addColorStop(0, themeBackground + "CC");
            leftGradient.addColorStop(1, themeTransparent);
            ctx.fillStyle = leftGradient;
            ctx.fillRect(0, 0, fadeWidth, h);

            // Right fade - matches CSS: linear-gradient(to left, colorCC 0%, transparent 100%)
            const rightGradient = ctx.createLinearGradient(w, 0, w - fadeWidth, 0);
            rightGradient.addColorStop(0, themeBackground + "CC");
            rightGradient.addColorStop(1, themeTransparent);
            ctx.fillStyle = rightGradient;
            ctx.fillRect(w - fadeWidth, 0, fadeWidth, h);

            // Radial vignette for corners - matches CSS: radial-gradient(ellipse at center, transparent X%, color80 100%)
            // CSS uses: transparent ${100 - vignetteSize * 2}% to color80 100%
            // For vignetteSize=15: transparent 70% to color80 100%
            const innerStop = Math.max(0, Math.min(0.99, (100 - vignetteSize * 2) / 100));
            // Use ellipse by scaling - make gradient cover the diagonal
            const diagonal = Math.sqrt(w * w + h * h) / 2;
            const radialGradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, diagonal);
            radialGradient.addColorStop(0, themeTransparent);
            radialGradient.addColorStop(innerStop, themeTransparent);
            radialGradient.addColorStop(1, themeBackground + "80");
            ctx.fillStyle = radialGradient;
            ctx.fillRect(0, 0, w, h);
          }

          // Draw location tag at bottom center (positioned at 82% height to survive cropping)
          if (showLocationTag && cityName) {
            // Scale tag size based on canvas size for consistent appearance
            const scaleFactor = Math.min(compositeCanvas.width, compositeCanvas.height) / 800;
            const tagPadding = Math.round(24 * scaleFactor);
            const tagHeight = Math.round(56 * scaleFactor);
            const fontSize = Math.round(28 * scaleFactor);
            const iconSize = Math.round(28 * scaleFactor);
            const iconGap = Math.round(16 * scaleFactor);

            ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
            const textWidth = ctx.measureText(cityName).width;
            const tagWidth = iconSize + iconGap + textWidth + tagPadding * 2;

            const tagX = (compositeCanvas.width - tagWidth) / 2;
            // Position at 82% of height to avoid being cropped during resize
            const tagY = compositeCanvas.height * 0.82 - tagHeight / 2;

            // Draw tag background with rounded corners
            ctx.beginPath();
            const radius = Math.round(12 * scaleFactor);
            ctx.roundRect(tagX, tagY, tagWidth, tagHeight, radius);
            ctx.fillStyle = isLightTheme ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.12)";
            ctx.fill();
            ctx.strokeStyle = isLightTheme ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.18)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw location pin icon
            const pinX = tagX + tagPadding;
            const pinY = tagY + (tagHeight - iconSize) / 2;

            ctx.strokeStyle = themeAccent;
            ctx.lineWidth = 2.5 * scaleFactor;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // Draw pin path (scaled to iconSize)
            const pinScale = iconSize / 24;
            ctx.save();
            ctx.translate(pinX, pinY);
            ctx.scale(pinScale, pinScale);

            // Pin body
            ctx.beginPath();
            ctx.arc(12, 10, 9, Math.PI, 0, false);
            ctx.lineTo(21, 10);
            ctx.quadraticCurveTo(21, 16, 12, 23);
            ctx.quadraticCurveTo(3, 16, 3, 10);
            ctx.stroke();

            // Inner circle
            ctx.beginPath();
            ctx.arc(12, 10, 3, 0, Math.PI * 2);
            ctx.stroke();

            ctx.restore();

            // Draw city name text
            const textX = pinX + iconSize + iconGap;
            const textY = tagY + tagHeight / 2 + fontSize / 3;

            ctx.fillStyle = isLightTheme ? "#1a1a1a" : "#ffffff";
            ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
            ctx.fillText(cityName, textX, textY);
          }

          const dataUrl = compositeCanvas.toDataURL("image/png");
          console.log("Captured image with overlays, size:", dataUrl.length, "chars");
          resolve(dataUrl);
        } else {
          const dataUrl = mapCanvas.toDataURL("image/png");
          console.log("Captured image size:", dataUrl.length, "chars");
          resolve(dataUrl);
        }
      });
      mapInstance.triggerRepaint();
    });
  },

  // Start generation
  startGeneration: async () => {
    const { selectedStyle, selectedDevices, captureMapCanvas, cropPosition } = get();

    set({ error: null, jobStatus: "pending", jobProgress: 0, generatedImages: [] });

    try {
      // Capture the current map view
      set({ jobProgress: 10 });
      const mapImage = await captureMapCanvas();

      if (!mapImage) {
        throw new Error("Failed to capture map");
      }

      set({ jobStatus: "processing", jobProgress: 30 });

      // Send to API for processing and AI upscaling
      const response = await fetch("/api/generate-wallpaper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: mapImage,
          style: selectedStyle,
          devices: selectedDevices,
          cropPosition,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate wallpaper");
      }

      set({ jobProgress: 80 });

      const data = await response.json();
      console.log("API response:", data);

      if (!data.wallpapers || data.wallpapers.length === 0) {
        throw new Error("No wallpapers generated");
      }

      set({
        jobStatus: "completed",
        jobProgress: 100,
        generatedImages: data.wallpapers.map((w: { device: string; url: string }) => ({
          device: w.device,
          url: w.url,
        })),
      });
    } catch (error) {
      console.error("Generation error:", error);
      set({
        error: error instanceof Error ? error.message : "Generation failed",
        jobStatus: "failed",
      });
    }
  },

  // Check job status
  checkStatus: async () => {
    const { currentJobId } = get();
    if (!currentJobId) return;

    try {
      const response = await fetch(`/api/status/${currentJobId}`);
      if (!response.ok) throw new Error("Failed to check status");

      const data = await response.json();
      set({
        jobStatus: data.status,
        jobProgress: data.progress || 0,
        error: data.error,
      });

      // If still processing, poll again
      if (data.status === "pending" || data.status === "processing") {
        setTimeout(() => get().checkStatus(), 1000);
      } else if (data.status === "completed") {
        // Get download links
        get().getDownloadLinks();
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Status check failed",
      });
    }
  },

  // Get download links
  getDownloadLinks: async () => {
    const { currentJobId } = get();
    if (!currentJobId) return;

    try {
      const response = await fetch(`/api/download/${currentJobId}`);
      if (!response.ok) throw new Error("Failed to get download links");

      const data = await response.json();
      set({
        generatedImages: data.downloads.map(
          (d: { device: string; url: string }) => ({
            device: d.device,
            url: d.url,
          })
        ),
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to get downloads",
      });
    }
  },

  // Reset state
  reset: () =>
    set({
      currentJobId: null,
      jobStatus: null,
      jobProgress: 0,
      generatedImages: [],
      error: null,
    }),
}));

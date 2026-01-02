import { create } from "zustand";
import { MapLocation, DeviceType, JobStatus, AIOptions } from "@/types";
import type { Map as MapLibreMap } from "maplibre-gl";

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

  // Device state
  selectedDevices: DeviceType[];
  toggleDevice: (device: DeviceType) => void;
  setSelectedDevices: (devices: DeviceType[]) => void;

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
    const { mapInstance } = get();
    console.log("Capturing map, instance:", !!mapInstance);

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
        const canvas = mapInstance.getCanvas();
        const dataUrl = canvas.toDataURL("image/png");
        console.log("Captured image size:", dataUrl.length, "chars");
        resolve(dataUrl);
      });
      mapInstance.triggerRepaint();
    });
  },

  // Start generation
  startGeneration: async () => {
    const { selectedStyle, selectedDevices, captureMapCanvas } = get();

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

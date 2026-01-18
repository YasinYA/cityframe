// Map types
export interface MapLocation {
  lat: number;
  lng: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

// Style types
export interface MapStyle {
  id: string;
  name: string;
  description: string;
  mapStyle: string; // Mapbox style URL or JSON
  preview: string; // Preview image URL
  isPro: boolean;
}

// Device types
export type DeviceType =
  | "iphone"
  | "android"
  | "tablet"
  | "tablet-landscape"
  | "desktop"
  | "ultrawide";

export interface DevicePreset {
  id: DeviceType;
  name: string;
  width: number;
  height: number;
  description: string;
}

// Crop position for device wallpapers
export type CropPosition =
  | "top-left" | "top" | "top-right"
  | "left" | "center" | "right"
  | "bottom-left" | "bottom" | "bottom-right";

// Job types
export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface GenerationJob {
  id: string;
  location: MapLocation;
  style: string;
  devices: DeviceType[];
  status: JobStatus;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface GeneratedImage {
  id: string;
  jobId: string;
  device: DeviceType;
  url: string;
  width: number;
  height: number;
}

// AI Enhancement types
export interface AIOptions {
  enabled: boolean;
  upscale: boolean;
  upscaleFactor: 2 | 4;
  enhanceStyle: boolean;
}

// API types
export interface GenerateRequest {
  location: MapLocation;
  style: string;
  devices: DeviceType[];
  ai?: AIOptions;
}

export interface GenerateResponse {
  jobId: string;
  status: JobStatus;
}

export interface JobStatusResponse {
  id: string;
  status: JobStatus;
  progress?: number;
  images?: GeneratedImage[];
  error?: string;
}

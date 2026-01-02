import { DeviceType } from "@/types";
import { STYLE_CONFIGS } from "./map/styles";

// Derive free and pro styles from config
export const FREE_STYLES = STYLE_CONFIGS.filter((s) => !s.premium).map((s) => s.id);
export const PRO_STYLES = STYLE_CONFIGS.filter((s) => s.premium).map((s) => s.id);
export const ALL_STYLES = STYLE_CONFIGS.map((s) => s.id);

export const FREE_DEVICES: DeviceType[] = ["iphone"];
export const PRO_DEVICES: DeviceType[] = ["android", "tablet", "desktop", "ultrawide"];
export const ALL_DEVICES: DeviceType[] = [...FREE_DEVICES, ...PRO_DEVICES];

export const MAX_FREE_GENERATIONS_PER_DAY = 3;

export interface FeatureAccess {
  canUseStyle: (styleId: string) => boolean;
  canUseDevice: (device: DeviceType) => boolean;
  hasWatermark: boolean;
  hasPriorityQueue: boolean;
  maxGenerationsPerDay: number | "unlimited";
  availableStyles: string[];
  availableDevices: DeviceType[];
}

export function getFeatureAccess(isPro: boolean): FeatureAccess {
  if (isPro) {
    return {
      canUseStyle: () => true,
      canUseDevice: () => true,
      hasWatermark: false,
      hasPriorityQueue: true,
      maxGenerationsPerDay: "unlimited",
      availableStyles: ALL_STYLES,
      availableDevices: ALL_DEVICES,
    };
  }

  return {
    canUseStyle: (styleId: string) => FREE_STYLES.includes(styleId),
    canUseDevice: (device: DeviceType) => FREE_DEVICES.includes(device),
    hasWatermark: true,
    hasPriorityQueue: false,
    maxGenerationsPerDay: MAX_FREE_GENERATIONS_PER_DAY,
    availableStyles: FREE_STYLES,
    availableDevices: FREE_DEVICES,
  };
}

export function isProStyle(styleId: string): boolean {
  return PRO_STYLES.includes(styleId);
}

export function isProDevice(device: DeviceType): boolean {
  return PRO_DEVICES.includes(device);
}

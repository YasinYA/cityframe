import { MapStyle, DevicePreset, DeviceType } from "@/types";

// =============================================================================
// CITYFRAME STYLES - Custom JSON wallpaper styles
// =============================================================================

export interface StyleConfig {
  id: string;
  name: string;
  category: "light" | "dark" | "colorful";
  description: string;
  premium: boolean;
  map: {
    background: string;
    roadColor: string;
    roadWidth: number;
    labels: boolean;
  };
}

// Custom style JSON URLs (hosted in /public/styles/)
const CUSTOM_STYLES = {
  "midnight-gold": "/styles/midnight-gold.json",
  "sage-minimalist": "/styles/sage-minimalist.json",
  "sunset-vibrant": "/styles/sunset-vibrant.json",
  "deep-ocean": "/styles/deep-ocean.json",
  "arctic-frost": "/styles/arctic-frost.json",
  "rose-noir": "/styles/rose-noir.json",
  "forest-night": "/styles/forest-night.json",
  "lavender-haze": "/styles/lavender-haze.json",
  "copper-industrial": "/styles/copper-industrial.json",
  "slate-minimal": "/styles/slate-minimal.json",
  "cherry-blossom": "/styles/cherry-blossom.json",
  "desert-sand": "/styles/desert-sand.json",
  "nordic-navy": "/styles/nordic-navy.json",
  "neon-city": "/styles/neon-city.json",
} as const;

// Style configurations - all use custom JSON files
export const STYLE_CONFIGS: StyleConfig[] = [
  // Dark themes
  {
    id: "midnight-gold",
    name: "Midnight Gold",
    category: "dark",
    description: "Elegant dark theme with gold primary roads and subtle buildings.",
    premium: false,
    map: {
      background: "#0f0f0f",
      roadColor: "#eab308",
      roadWidth: 3,
      labels: false,
    },
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    category: "dark",
    description: "Dark oceanic blue theme with cyan highlights.",
    premium: false,
    map: {
      background: "#0f172a",
      roadColor: "#06b6d4",
      roadWidth: 3,
      labels: false,
    },
  },
  {
    id: "rose-noir",
    name: "Rose Noir",
    category: "dark",
    description: "Dark romantic theme with rose red accents.",
    premium: false,
    map: {
      background: "#1c1017",
      roadColor: "#f43f5e",
      roadWidth: 3,
      labels: false,
    },
  },
  {
    id: "forest-night",
    name: "Forest Night",
    category: "dark",
    description: "Deep forest green theme with emerald roads.",
    premium: false,
    map: {
      background: "#0a1f1a",
      roadColor: "#22c55e",
      roadWidth: 2.5,
      labels: false,
    },
  },
  {
    id: "copper-industrial",
    name: "Copper Industrial",
    category: "dark",
    description: "Industrial dark stone with warm copper highlights.",
    premium: false,
    map: {
      background: "#1c1917",
      roadColor: "#ea580c",
      roadWidth: 3,
      labels: false,
    },
  },
  {
    id: "slate-minimal",
    name: "Slate Minimal",
    category: "dark",
    description: "Clean minimal slate with white roads.",
    premium: false,
    map: {
      background: "#0f172a",
      roadColor: "#f8fafc",
      roadWidth: 2,
      labels: false,
    },
  },
  // Light themes
  {
    id: "sage-minimalist",
    name: "Sage Minimalist",
    category: "light",
    description: "Light, fresh green theme with calming sage tones.",
    premium: false,
    map: {
      background: "#f0fdf4",
      roadColor: "#10b981",
      roadWidth: 2.5,
      labels: false,
    },
  },
  {
    id: "sunset-vibrant",
    name: "Sunset Vibrant",
    category: "colorful",
    description: "Warm, energetic sunset palette with orange accents.",
    premium: false,
    map: {
      background: "#fef3c7",
      roadColor: "#f97316",
      roadWidth: 3,
      labels: false,
    },
  },
  {
    id: "arctic-frost",
    name: "Arctic Frost",
    category: "light",
    description: "Cool icy blue theme with crisp winter feel.",
    premium: false,
    map: {
      background: "#f0f9ff",
      roadColor: "#0ea5e9",
      roadWidth: 2.5,
      labels: false,
    },
  },
  {
    id: "lavender-haze",
    name: "Lavender Haze",
    category: "light",
    description: "Soft purple dreamy theme with violet accents.",
    premium: false,
    map: {
      background: "#faf5ff",
      roadColor: "#a855f7",
      roadWidth: 2.5,
      labels: false,
    },
  },
  {
    id: "cherry-blossom",
    name: "Cherry Blossom",
    category: "light",
    description: "Delicate pink Japanese-inspired spring theme.",
    premium: false,
    map: {
      background: "#fff1f2",
      roadColor: "#e11d48",
      roadWidth: 2.5,
      labels: false,
    },
  },
  {
    id: "desert-sand",
    name: "Desert Sand",
    category: "light",
    description: "Warm sandy beige with earthy brown roads.",
    premium: false,
    map: {
      background: "#fefce8",
      roadColor: "#92400e",
      roadWidth: 2.5,
      labels: false,
    },
  },
  {
    id: "nordic-navy",
    name: "Nordic Navy",
    category: "dark",
    description: "Clean minimalist navy blue with white roads. Classic wall art style.",
    premium: false,
    map: {
      background: "#1e2a4a",
      roadColor: "#ffffff",
      roadWidth: 1.8,
      labels: false,
    },
  },
  {
    id: "neon-city",
    name: "Neon City",
    category: "dark",
    description: "Cyberpunk neon glow with magenta and cyan roads on pure black.",
    premium: false,
    map: {
      background: "#000000",
      roadColor: "#ff00ff",
      roadWidth: 2,
      labels: false,
    },
  },
];

// Get the map style URL for a config (all are custom JSON)
function getMapStyleUrl(config: StyleConfig): string {
  return CUSTOM_STYLES[config.id as keyof typeof CUSTOM_STYLES];
}

// Legacy MapStyle format for compatibility
export const MAP_STYLES: MapStyle[] = STYLE_CONFIGS.map((config) => ({
  id: config.id,
  name: config.name,
  description: config.description,
  mapStyle: getMapStyleUrl(config),
  preview: `/styles/${config.id}.png`,
  isPro: config.premium,
}));

// Style icons for the picker
export const STYLE_ICONS: Record<string, string> = {
  "midnight-gold": "◆",
  "deep-ocean": "◈",
  "rose-noir": "❖",
  "forest-night": "◉",
  "copper-industrial": "▣",
  "slate-minimal": "━",
  "sage-minimalist": "○",
  "sunset-vibrant": "◐",
  "arctic-frost": "❄",
  "lavender-haze": "◇",
  "cherry-blossom": "✿",
  "desert-sand": "◬",
  "nordic-navy": "▬",
  "neon-city": "◈",
};

// Style gradient backgrounds for previews
export const STYLE_GRADIENTS: Record<string, string> = {
  "midnight-gold": "from-zinc-950 via-yellow-900/40 to-zinc-950",
  "deep-ocean": "from-slate-950 via-cyan-950 to-slate-950",
  "rose-noir": "from-rose-950 via-pink-950 to-rose-950",
  "forest-night": "from-emerald-950 via-green-950 to-emerald-950",
  "copper-industrial": "from-stone-950 via-orange-950 to-stone-950",
  "slate-minimal": "from-slate-900 via-slate-800 to-slate-900",
  "sage-minimalist": "from-emerald-100 via-green-50 to-emerald-100",
  "sunset-vibrant": "from-amber-200 via-orange-100 to-amber-200",
  "arctic-frost": "from-sky-100 via-blue-50 to-sky-100",
  "lavender-haze": "from-purple-100 via-violet-50 to-purple-100",
  "cherry-blossom": "from-pink-100 via-rose-50 to-pink-100",
  "desert-sand": "from-amber-100 via-yellow-50 to-amber-100",
  "nordic-navy": "from-blue-950 via-indigo-950 to-blue-950",
  "neon-city": "from-black via-fuchsia-950 to-black",
};

// Device presets
export const DEVICE_PRESETS: Record<DeviceType, DevicePreset> = {
  iphone: {
    id: "iphone",
    name: "iPhone",
    width: 1170,
    height: 2532,
    description: "iPhone 12/13/14 Pro",
  },
  android: {
    id: "android",
    name: "Android",
    width: 1440,
    height: 3200,
    description: "Most Android flagships",
  },
  tablet: {
    id: "tablet",
    name: "Tablet",
    width: 2048,
    height: 2732,
    description: "iPad Pro 12.9\"",
  },
  "tablet-landscape": {
    id: "tablet-landscape",
    name: "Tablet Landscape",
    width: 2732,
    height: 2048,
    description: "iPad Pro landscape",
  },
  desktop: {
    id: "desktop",
    name: "Desktop",
    width: 3840,
    height: 2160,
    description: "4K monitors",
  },
  ultrawide: {
    id: "ultrawide",
    name: "Ultra-wide",
    width: 5120,
    height: 1440,
    description: "32:9 ultra-wide monitors",
  },
};

// Device icons
export const DEVICE_ICONS: Record<DeviceType, string> = {
  iphone: "📱",
  android: "📱",
  tablet: "📲",
  "tablet-landscape": "📲",
  desktop: "🖥️",
  ultrawide: "🖥️",
};

// Helper functions
export function getStyleById(id: string): MapStyle | undefined {
  return MAP_STYLES.find((s) => s.id === id);
}

export function getStyleConfig(id: string): StyleConfig | undefined {
  return STYLE_CONFIGS.find((s) => s.id === id);
}

export function getDevicePreset(device: DeviceType): DevicePreset {
  return DEVICE_PRESETS[device];
}

export function isProStyle(id: string): boolean {
  const config = getStyleConfig(id);
  return config?.premium ?? false;
}

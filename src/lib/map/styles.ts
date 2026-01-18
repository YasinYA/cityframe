import { MapStyle, DevicePreset, DeviceType } from "@/types";

// =============================================================================
// CITYFRAME STYLES - Custom JSON wallpaper styles
// =============================================================================

// Road hierarchy colors (inspired by MapToPoster)
export interface RoadColors {
  motorway: string;
  primary: string;
  secondary: string;
  tertiary: string;
  residential: string;
  default: string;
}

// Road width hierarchy
export interface RoadWidths {
  motorway: number;
  primary: number;
  secondary: number;
  tertiary: number;
  residential: number;
  default: number;
}

export interface StyleConfig {
  id: string;
  name: string;
  category: "light" | "dark" | "colorful";
  description: string;
  premium: boolean;
  map: {
    background: string;
    // Road hierarchy - can be full object or single color string (for backwards compat)
    roads: RoadColors | string;
    // Road widths - optional, defaults provided
    roadWidths?: Partial<RoadWidths>;
    // Feature colors (null = hidden/same as background)
    water?: string | null;
    parks?: string | null;
    buildings?: string | null;
    // Other options
    labels: boolean;
    contours?: boolean;
    contourColor?: string;
    contourWidth?: number;
    glow?: boolean;
    glowColor?: string;
    glowIntensity?: number;
  };
}

// Helper to normalize road colors (handle string or object)
export function getRoadColors(roads: RoadColors | string): RoadColors {
  if (typeof roads === "string") {
    return {
      motorway: roads,
      primary: roads,
      secondary: roads,
      tertiary: roads,
      residential: roads,
      default: roads,
    };
  }
  return roads;
}

// Default road widths
export const DEFAULT_ROAD_WIDTHS: RoadWidths = {
  motorway: 3,
  primary: 2.5,
  secondary: 2,
  tertiary: 1.5,
  residential: 1,
  default: 1,
};

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
  "japanese-ink": "/styles/japanese-ink.json",
  "blueprint": "/styles/blueprint.json",
  "autumn": "/styles/autumn.json",
  "noir": "/styles/noir.json",
  "pastel-dream": "/styles/pastel-dream.json",
  "terracotta": "/styles/terracotta.json",
  "warm-beige": "/styles/warm-beige.json",
} as const;

// Style configurations - all use custom JSON files
// Road colors now support hierarchy (motorway → residential) inspired by MapToPoster
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
      roads: {
        motorway: "#fbbf24",
        primary: "#eab308",
        secondary: "#ca8a04",
        tertiary: "#a16207",
        residential: "#713f12",
        default: "#a16207",
      },
      water: "#0a0a0a",
      parks: null,
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
      roads: {
        motorway: "#22d3ee",
        primary: "#06b6d4",
        secondary: "#0891b2",
        tertiary: "#0e7490",
        residential: "#155e75",
        default: "#0e7490",
      },
      water: "#0c1222",
      parks: null,
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
      roads: {
        motorway: "#fb7185",
        primary: "#f43f5e",
        secondary: "#e11d48",
        tertiary: "#be123c",
        residential: "#9f1239",
        default: "#be123c",
      },
      water: "#170d12",
      parks: null,
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
      roads: {
        motorway: "#4ade80",
        primary: "#22c55e",
        secondary: "#16a34a",
        tertiary: "#15803d",
        residential: "#166534",
        default: "#15803d",
      },
      water: "#071512",
      parks: "#0d2920",
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
      roads: {
        motorway: "#fb923c",
        primary: "#ea580c",
        secondary: "#c2410c",
        tertiary: "#9a3412",
        residential: "#7c2d12",
        default: "#9a3412",
      },
      water: "#171412",
      parks: null,
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
      roads: {
        motorway: "#f8fafc",
        primary: "#e2e8f0",
        secondary: "#cbd5e1",
        tertiary: "#94a3b8",
        residential: "#64748b",
        default: "#94a3b8",
      },
      water: "#0c1322",
      parks: null,
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
      roads: {
        motorway: "#059669",
        primary: "#10b981",
        secondary: "#34d399",
        tertiary: "#6ee7b7",
        residential: "#a7f3d0",
        default: "#6ee7b7",
      },
      water: "#9EC5B8",
      parks: "#dcfce7",
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
      roads: {
        motorway: "#ea580c",
        primary: "#f97316",
        secondary: "#fb923c",
        tertiary: "#fdba74",
        residential: "#fed7aa",
        default: "#fdba74",
      },
      water: "#D4A574",
      parks: "#fef08a",
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
      roads: {
        motorway: "#0284c7",
        primary: "#0ea5e9",
        secondary: "#38bdf8",
        tertiary: "#7dd3fc",
        residential: "#bae6fd",
        default: "#7dd3fc",
      },
      water: "#A8D4E6",
      parks: null,
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
      roads: {
        motorway: "#9333ea",
        primary: "#a855f7",
        secondary: "#c084fc",
        tertiary: "#d8b4fe",
        residential: "#e9d5ff",
        default: "#d8b4fe",
      },
      water: "#C4B8D8",
      parks: "#ede9fe",
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
      roads: {
        motorway: "#be123c",
        primary: "#e11d48",
        secondary: "#f43f5e",
        tertiary: "#fb7185",
        residential: "#fda4af",
        default: "#fb7185",
      },
      water: "#D4B8C0",
      parks: "#fecdd3",
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
      roads: {
        motorway: "#78350f",
        primary: "#92400e",
        secondary: "#a16207",
        tertiary: "#ca8a04",
        residential: "#eab308",
        default: "#ca8a04",
      },
      water: "#C9B896",
      parks: "#fef08a",
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
      roads: {
        motorway: "#ffffff",
        primary: "#e2e8f0",
        secondary: "#cbd5e1",
        tertiary: "#94a3b8",
        residential: "#64748b",
        default: "#94a3b8",
      },
      water: "#192240",
      parks: null,
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
      background: "#0D0D1A",
      roads: {
        motorway: "#FF00FF",
        primary: "#00FFFF",
        secondary: "#00C8C8",
        tertiary: "#0098A0",
        residential: "#006870",
        default: "#0098A0",
      },
      water: "#0A0A15",
      parks: "#151525",
      labels: false,
      glow: true,
      glowColor: "#FF00FF",
      glowIntensity: 0.5,
    },
  },
  // NEW: Japanese Ink theme (ported from MapToPoster)
  {
    id: "japanese-ink",
    name: "Japanese Ink",
    category: "light",
    description: "Traditional ink wash inspired - minimalist with subtle red accent.",
    premium: true,
    map: {
      background: "#FAF8F5",
      roads: {
        motorway: "#8B2500",
        primary: "#4A4A4A",
        secondary: "#6A6A6A",
        tertiary: "#909090",
        residential: "#B8B8B8",
        default: "#909090",
      },
      water: "#E8E4E0",
      parks: "#F0EDE8",
      labels: false,
    },
  },
  // NEW: Blueprint theme (ported from MapToPoster)
  {
    id: "blueprint",
    name: "Blueprint",
    category: "dark",
    description: "Classic architectural blueprint style with white lines on deep blue.",
    premium: true,
    map: {
      background: "#1a3a5c",
      roads: {
        motorway: "#ffffff",
        primary: "#e8f4fc",
        secondary: "#c8dff0",
        tertiary: "#a8c8e0",
        residential: "#88b0d0",
        default: "#a8c8e0",
      },
      water: "#153050",
      parks: null,
      labels: false,
    },
  },
  // NEW: Autumn theme (ported from MapToPoster)
  {
    id: "autumn",
    name: "Autumn",
    category: "light",
    description: "Warm fall colors with burnt oranges, deep reds, and golden yellows.",
    premium: true,
    map: {
      background: "#FBF7F0",
      roads: {
        motorway: "#8B2500",
        primary: "#B8450A",
        secondary: "#CC7A30",
        tertiary: "#D9A050",
        residential: "#E8C888",
        default: "#CC7A30",
      },
      water: "#A8B8B8",
      parks: "#E8E0D0",
      labels: false,
    },
  },
  // NEW: Noir theme (ported from MapToPoster)
  {
    id: "noir",
    name: "Noir",
    category: "dark",
    description: "Pure black and white high contrast - modern gallery aesthetic.",
    premium: true,
    map: {
      background: "#000000",
      roads: {
        motorway: "#FFFFFF",
        primary: "#E0E0E0",
        secondary: "#B0B0B0",
        tertiary: "#808080",
        residential: "#505050",
        default: "#808080",
      },
      water: "#0A0A0A",
      parks: "#111111",
      labels: false,
    },
  },
  // NEW: Pastel Dream theme (ported from MapToPoster)
  {
    id: "pastel-dream",
    name: "Pastel Dream",
    category: "light",
    description: "Soft muted pastels with dusty blues and mauves.",
    premium: true,
    map: {
      background: "#FAF7F2",
      roads: {
        motorway: "#7B8794",
        primary: "#9BA4B0",
        secondary: "#B5AEBB",
        tertiary: "#C9C0C9",
        residential: "#D8D2D8",
        default: "#C9C0C9",
      },
      water: "#D4E4ED",
      parks: "#E8EDE4",
      labels: false,
    },
  },
  // NEW: Terracotta theme (ported from MapToPoster)
  {
    id: "terracotta",
    name: "Terracotta",
    category: "light",
    description: "Mediterranean warmth with earthy clay and burnt orange tones.",
    premium: true,
    map: {
      background: "#F5EDE4",
      roads: {
        motorway: "#A0522D",
        primary: "#B8653A",
        secondary: "#C9846A",
        tertiary: "#D9A08A",
        residential: "#E5C4B0",
        default: "#D9A08A",
      },
      water: "#A8C4C4",
      parks: "#E8E0D0",
      labels: false,
    },
  },
  // NEW: Warm Beige theme (ported from MapToPoster)
  {
    id: "warm-beige",
    name: "Warm Beige",
    category: "light",
    description: "Vintage cartographic style with earthy sepia tones.",
    premium: true,
    map: {
      background: "#F5F0E8",
      roads: {
        motorway: "#8B7355",
        primary: "#A08B70",
        secondary: "#B5A48E",
        tertiary: "#C9BBAA",
        residential: "#D9CFC2",
        default: "#C9BBAA",
      },
      water: "#B8C4C4",
      parks: "#E8E4D8",
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
  "japanese-ink": "墨",
  "blueprint": "▦",
  "autumn": "🍂",
  "noir": "◼",
  "pastel-dream": "◌",
  "terracotta": "▤",
  "warm-beige": "▧",
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
  "japanese-ink": "from-stone-100 via-stone-50 to-stone-100",
  "blueprint": "from-blue-900 via-blue-800 to-blue-900",
  "autumn": "from-orange-100 via-amber-50 to-orange-100",
  "noir": "from-black via-zinc-900 to-black",
  "pastel-dream": "from-slate-100 via-purple-50 to-slate-100",
  "terracotta": "from-orange-100 via-stone-50 to-orange-100",
  "warm-beige": "from-amber-100 via-stone-50 to-amber-100",
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

export interface StyleTransform {
  grayscale?: boolean;
  brightness?: number;
  saturation?: number;
  hue?: number;
  tint?: { r: number; g: number; b: number };
  contrast?: number;
}

export function getStyleTransform(styleId: string): StyleTransform {
  // Map styles are pre-styled via JSON, so we return minimal transforms
  // Additional transforms can be added per-style if needed
  const config = getStyleConfig(styleId);
  if (!config) return {};

  // Apply subtle enhancements based on style category
  switch (config.category) {
    case "dark":
      return { contrast: 1.1 };
    case "colorful":
      return { saturation: 1.1 };
    default:
      return {};
  }
}

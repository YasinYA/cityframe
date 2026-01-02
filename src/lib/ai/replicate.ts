import Replicate from "replicate";

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// AI Model configurations
export const AI_MODELS = {
  // Real-ESRGAN for upscaling
  upscale: "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",

  // SDXL for style transfer/enhancement
  styleTransfer: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",

  // ControlNet for map-aware enhancements
  controlnet: "jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638f88307bdaf1c2f1ac95079c9613",
} as const;

// Style-specific AI enhancement prompts
export const STYLE_PROMPTS: Record<string, string> = {
  "midnight-gold": "luxury gold accents on dark map, elegant cartography, premium design, metallic gold highlights, dark background",
  "deep-ocean": "deep ocean blue cityscape, cyan highlights, underwater feel, dark moody aesthetic",
  "rose-noir": "dark romantic cityscape, rose pink accents, noir aesthetic, dramatic lighting",
  "forest-night": "deep forest night scene, emerald green highlights, natural woodland aesthetic",
  "copper-industrial": "industrial urban map, copper and bronze metallic tones, steampunk aesthetic",
  "slate-minimal": "clean minimalist map, subtle line art, elegant cartography, dark slate background, thin white lines",
  "sage-minimalist": "fresh natural map, sage green tones, clean minimalist design, light background",
  "sunset-vibrant": "warm sunset cityscape, orange and amber tones, vibrant energy, golden hour aesthetic",
  "arctic-frost": "icy winter landscape, frost blue tones, crisp clean aesthetic, arctic feel",
  "lavender-haze": "dreamy purple cityscape, lavender and violet tones, soft ethereal aesthetic",
  "cherry-blossom": "japanese spring aesthetic, delicate pink cherry blossom, elegant minimal design",
  "desert-sand": "warm desert landscape, sandy earth tones, natural beige aesthetic",
  "nordic-navy": "clean minimalist map, navy blue background, white roads, scandinavian design, elegant wall art",
  "neon-city": "cyberpunk neon city map, glowing magenta and cyan roads, synthwave aesthetic, black background, neon lights",
};

// Negative prompts to avoid common issues
export const NEGATIVE_PROMPT = "blurry, low quality, distorted, text, watermark, logo, signature, cropped, out of frame";

export type AIEnhancementOptions = {
  style: string;
  upscale?: boolean;
  upscaleFactor?: 2 | 4;
  enhanceStyle?: boolean;
  imageUrl: string;
};

export type AIEnhancementResult = {
  success: boolean;
  imageUrl?: string;
  error?: string;
};

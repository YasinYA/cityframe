import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import sharp from "sharp";
import { headers } from "next/headers";
import { DeviceType, CropPosition } from "@/types";
import { DEVICE_PRESETS } from "@/lib/map/styles";
import { auth } from "@/lib/auth";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/redis/rateLimit";

interface GenerateWallpaperRequest {
  image: string; // base64 data URL from client
  style: string;
  devices: DeviceType[];
  cropPosition?: CropPosition;
}

// Rate limit: 20 AI generations per user per hour
const USER_RATE_LIMIT = {
  maxRequests: 20,
  windowSeconds: 3600,
  prefix: "ratelimit:ai-gen:user",
};

// Rate limit: 50 AI generations per IP per hour
const IP_RATE_LIMIT = {
  maxRequests: 50,
  windowSeconds: 3600,
  prefix: "ratelimit:ai-gen:ip",
};

// Map CropPosition to sharp position string
function getSharpPosition(cropPosition: CropPosition): string {
  const positionMap: Record<CropPosition, string> = {
    "top-left": "left top",
    "top": "top",
    "top-right": "right top",
    "left": "left",
    "center": "center",
    "right": "right",
    "bottom-left": "left bottom",
    "bottom": "bottom",
    "bottom-right": "right bottom",
  };
  return positionMap[cropPosition] || "center";
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Upscale image using Real-ESRGAN on Replicate
async function upscaleImage(imageBuffer: Buffer, scale: number = 4): Promise<Buffer> {
  // Convert buffer to base64 data URL for Replicate
  const base64 = imageBuffer.toString("base64");
  const mimeType = "image/png";
  const dataUrl = `data:${mimeType};base64,${base64}`;

  console.log("Upscaling image with Real-ESRGAN...");

  const output = await replicate.run(
    "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
    {
      input: {
        image: dataUrl,
        scale: scale,
        face_enhance: false,
      },
    }
  );

  // Output is a URL to the upscaled image
  const upscaledUrl = output as unknown as string;
  console.log("Upscaled image URL:", upscaledUrl);

  // Fetch the upscaled image
  const response = await fetch(upscaledUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch upscaled image");
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(new Uint8Array(arrayBuffer));
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") ||
               "unknown";

    // Check IP rate limit first
    const ipLimit = await checkRateLimit(ip, IP_RATE_LIMIT);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: getRateLimitHeaders(ipLimit) }
      );
    }

    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to generate wallpapers." },
        { status: 401 }
      );
    }

    // Check user-specific rate limit
    const userLimit = await checkRateLimit(session.user.email, USER_RATE_LIMIT);
    if (!userLimit.allowed) {
      return NextResponse.json(
        { error: "You've reached the hourly generation limit. Please try again later." },
        { status: 429, headers: getRateLimitHeaders(userLimit) }
      );
    }

    const body: GenerateWallpaperRequest = await request.json();
    const { image, devices, cropPosition = "center" } = body;

    console.log("Generating wallpapers for devices:", devices, "crop:", cropPosition);

    if (!image || !devices || devices.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: image, devices" },
        { status: 400 }
      );
    }

    // Validate image size (max 10MB base64)
    if (image.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Extract base64 data from data URL
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    let imageBuffer: Buffer = Buffer.from(base64Data, "base64");

    // Get source image dimensions
    const metadata = await sharp(imageBuffer).metadata();
    console.log(`Source image: ${metadata.width}x${metadata.height}`);

    // Always upscale with AI for maximum quality
    if (process.env.REPLICATE_API_TOKEN) {
      console.log("Upscaling with AI for 4K quality...");
      try {
        imageBuffer = await upscaleImage(imageBuffer, 4);
        const upscaledMeta = await sharp(imageBuffer).metadata();
        console.log(`Upscaled to: ${upscaledMeta.width}x${upscaledMeta.height}`);
      } catch (upscaleError) {
        console.error("Upscaling failed, continuing with original:", upscaleError);
      }
    } else {
      console.warn("REPLICATE_API_TOKEN not set, skipping AI upscale");
    }

    // Process image for each device
    const wallpapers = await Promise.all(
      devices.map(async (device) => {
        const preset = DEVICE_PRESETS[device];
        if (!preset) {
          console.error(`Unknown device: ${device}`);
          throw new Error(`Unknown device: ${device}`);
        }

        console.log(`Processing ${device}: ${preset.width}x${preset.height}`);

        // Resize and crop to device dimensions
        const processedBuffer = await sharp(imageBuffer)
          .resize(preset.width, preset.height, {
            fit: "cover",
            position: getSharpPosition(cropPosition),
          })
          .png({ quality: 100 })
          .toBuffer();

        // Convert to base64 data URL for direct download
        const base64Output = processedBuffer.toString("base64");
        const dataUrl = `data:image/png;base64,${base64Output}`;

        console.log(`Generated ${device}: ${Math.round(dataUrl.length / 1024)}KB`);

        return {
          device,
          url: dataUrl,
          width: preset.width,
          height: preset.height,
        };
      })
    );

    return NextResponse.json({ wallpapers });
  } catch (error) {
    console.error("Wallpaper generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}

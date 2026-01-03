import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import sharp from "sharp";
import { DeviceType } from "@/types";
import { DEVICE_PRESETS } from "@/lib/map/styles";

interface GenerateWallpaperRequest {
  image: string; // base64 data URL from client
  style: string;
  devices: DeviceType[];
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
    const body: GenerateWallpaperRequest = await request.json();
    const { image, devices } = body;

    console.log("Generating wallpapers for devices:", devices);

    if (!image || !devices || devices.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: image, devices" },
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
            position: "center",
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

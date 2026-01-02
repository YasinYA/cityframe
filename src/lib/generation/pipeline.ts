import puppeteer, { Browser } from "puppeteer";
import sharp from "sharp";
import { MapLocation, DeviceType } from "@/types";
import { DEVICE_PRESETS, getStyleById, getStyleTransform } from "@/lib/map/styles";

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    });
  }
  return browser;
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

interface SnapshotOptions {
  location: MapLocation;
  style: string;
  width: number;
  height: number;
}

export async function captureMapSnapshot(
  options: SnapshotOptions
): Promise<Buffer> {
  const { location, style, width, height } = options;
  const styleConfig = getStyleById(style);
  // Default to OpenFreeMap Positron style (no API key required!)
  const mapStyle = styleConfig?.mapStyle || "https://tiles.openfreemap.org/styles/positron";

  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Set viewport to desired size (with padding for better capture)
    await page.setViewport({
      width: Math.min(width, 2048), // Limit initial size
      height: Math.min(height, 2048),
      deviceScaleFactor: 2, // Retina quality
    });

    // Create a simple HTML page with MapLibre (open-source, no API key!)
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
          <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; }
            body, html { width: 100%; height: 100%; overflow: hidden; }
            #map { width: 100%; height: 100%; }
            .maplibregl-ctrl-logo, .maplibregl-ctrl-attrib { display: none !important; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            const map = new maplibregl.Map({
              container: 'map',
              style: '${mapStyle}',
              center: [${location.lng}, ${location.lat}],
              zoom: ${location.zoom},
              bearing: ${location.bearing},
              pitch: ${location.pitch},
              preserveDrawingBuffer: true,
              interactive: false
            });

            map.on('load', () => {
              // Signal that map is ready
              window.mapReady = true;
            });
          </script>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });

    // Wait for map to be ready
    await page.waitForFunction("window.mapReady === true", { timeout: 30000 });

    // Additional wait for tiles to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Take screenshot
    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
    });

    return Buffer.from(screenshot);
  } finally {
    await page.close();
  }
}

interface ProcessOptions {
  buffer: Buffer;
  targetWidth: number;
  targetHeight: number;
  style: string;
}

export async function processImage(options: ProcessOptions): Promise<Buffer> {
  const { buffer, targetWidth, targetHeight, style } = options;
  const transform = getStyleTransform(style);

  let sharpInstance = sharp(buffer);

  // Resize to exact target dimensions (center crop if needed)
  sharpInstance = sharpInstance.resize(targetWidth, targetHeight, {
    fit: "cover",
    position: "center",
  });

  // Apply grayscale first if specified
  if (transform.grayscale) {
    sharpInstance = sharpInstance.grayscale();
  }

  // Apply modulation (brightness, saturation, hue)
  const modulate: { brightness?: number; saturation?: number; hue?: number } = {};
  if (transform.brightness !== undefined) modulate.brightness = transform.brightness;
  if (transform.saturation !== undefined) modulate.saturation = transform.saturation;
  if (transform.hue !== undefined) modulate.hue = transform.hue;

  if (Object.keys(modulate).length > 0) {
    sharpInstance = sharpInstance.modulate(modulate);
  }

  // Apply tint (colorize the image)
  if (transform.tint) {
    sharpInstance = sharpInstance.tint({
      r: transform.tint.r,
      g: transform.tint.g,
      b: transform.tint.b,
    });
  }

  // Apply linear contrast adjustment
  if (transform.contrast !== undefined && transform.contrast !== 1) {
    const a = transform.contrast;
    const b = 128 * (1 - a);
    sharpInstance = sharpInstance.linear(a, b);
  }

  // Output as high-quality PNG
  return sharpInstance.png({ quality: 100 }).toBuffer();
}

export interface GeneratedWallpaper {
  device: DeviceType;
  buffer: Buffer;
  width: number;
  height: number;
}

export async function generateWallpapers(
  location: MapLocation,
  style: string,
  devices: DeviceType[]
): Promise<GeneratedWallpaper[]> {
  const results: GeneratedWallpaper[] = [];

  // Capture base map snapshot at high resolution
  const baseSnapshot = await captureMapSnapshot({
    location,
    style,
    width: 2048,
    height: 2048,
  });

  // Process for each device
  for (const device of devices) {
    const preset = DEVICE_PRESETS[device];
    const processed = await processImage({
      buffer: baseSnapshot,
      targetWidth: preset.width,
      targetHeight: preset.height,
      style,
    });

    results.push({
      device,
      buffer: processed,
      width: preset.width,
      height: preset.height,
    });
  }

  return results;
}

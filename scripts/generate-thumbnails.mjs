import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public', 'styles');

// All style IDs in order they appear in the picker
const STYLES = [
  'midnight-gold',
  'deep-ocean',
  'rose-noir',
  'forest-night',
  'copper-industrial',
  'slate-minimal',
  'sage-minimalist',
  'sunset-vibrant',
  'arctic-frost',
  'lavender-haze',
  'cherry-blossom',
  'desert-sand',
  'nordic-navy',
  'neon-city',
];

async function generateThumbnails() {
  console.log('🚀 Starting thumbnail generation...');
  console.log('Make sure the dev server is running on http://localhost:3000\n');

  const browser = await puppeteer.launch({
    headless: false, // Need GPU rendering for WebGL
    args: ['--no-sandbox', '--window-size=1200,800'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // Navigate to main app
  console.log('📍 Loading main app...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  // Wait longer for initial map load
  await new Promise(resolve => setTimeout(resolve, 6000));

  // Hide the city name card by clicking its close button
  console.log('📍 Hiding city card...');
  try {
    const closeButton = await page.$('button[aria-label="Hide city name"]');
    if (closeButton) {
      await closeButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (e) {
    console.log('City card not found or already hidden');
  }

  // Double-check the card is hidden
  await page.evaluate(() => {
    const card = document.querySelector('[class*="bottom-24"]');
    if (card) card.style.display = 'none';
  });
  await new Promise(resolve => setTimeout(resolve, 500));

  for (let i = 0; i < STYLES.length; i++) {
    const styleId = STYLES[i];
    console.log(`📸 Generating thumbnail for: ${styleId} (${i + 1}/${STYLES.length})`);

    try {
      // Click on the style button (they're in order)
      const styleButtons = await page.$$('button[class*="rounded-lg"][class*="border-2"]');
      if (styleButtons[i]) {
        await styleButtons[i].click();
        // Wait for map to update and tiles to load
        await new Promise(resolve => setTimeout(resolve, 4000));
      }

      // Hide city card before each screenshot (in case it reappeared)
      await page.evaluate(() => {
        const cards = document.querySelectorAll('[class*="bottom-24"], [class*="LOCATION"]');
        cards.forEach(card => card.style.display = 'none');
      });

      // Find the map container and screenshot it
      const mapElement = await page.$('.maplibregl-map');
      if (mapElement) {
        const outputPath = path.join(publicDir, `${styleId}.png`);

        // Get map bounds and take a cropped screenshot
        const box = await mapElement.boundingBox();

        // Take a 400x533 crop from the center of the map
        const cropWidth = 400;
        const cropHeight = 533;
        const cropX = box.x + (box.width - cropWidth) / 2;
        const cropY = box.y + (box.height - cropHeight) / 2;

        await page.screenshot({
          path: outputPath,
          type: 'png',
          clip: {
            x: Math.max(0, cropX),
            y: Math.max(0, cropY),
            width: cropWidth,
            height: cropHeight,
          },
        });

        console.log(`✅ Saved: ${outputPath}`);
      } else {
        console.log(`⚠️ Map element not found for ${styleId}`);
      }
    } catch (error) {
      console.log(`⚠️ Error for ${styleId}: ${error.message}`);
    }
  }

  await browser.close();
  console.log('\n🎉 All thumbnails generated!');
}

generateThumbnails().catch(console.error);

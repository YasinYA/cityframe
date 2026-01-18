#!/usr/bin/env node
/**
 * Capture screenshots for theme previews
 * Usage: node scripts/capture-theme-screenshots.js [theme-id]
 *
 * If no theme-id is provided, captures all themes missing screenshots.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const THEMES = [
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
  'japanese-ink',
  'blueprint',
  'autumn',
  'noir',
  'pastel-dream',
  'terracotta',
  'warm-beige',
];

const STYLES_DIR = path.join(__dirname, '../public/styles');
const APP_URL = 'http://localhost:3000/app';

// Default location: Tokyo
const DEFAULT_LOCATION = {
  lat: 35.6762,
  lng: 139.6503,
  zoom: 13,
};

async function captureThemeScreenshot(browser, themeId) {
  console.log(`Capturing screenshot for: ${themeId}`);

  const page = await browser.newPage();
  // Use a larger viewport so the page layout works correctly
  await page.setViewport({ width: 1200, height: 800 });

  // Navigate directly to city page with style (use new-york as default city)
  console.log(`  Navigating to city page with style: ${themeId}`);
  await page.goto(`http://localhost:3000/city/new-york/${themeId}`, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  // Wait for map canvas to be present and have dimensions
  try {
    await page.waitForSelector('.maplibregl-canvas', { timeout: 15000 });
    console.log(`  Found map canvas`);
  } catch (e) {
    console.log(`  Map canvas not found, trying alternatives...`);
  }

  // Wait extra time for tiles to load
  console.log(`  Waiting for tiles to load...`);
  await new Promise(r => setTimeout(r, 8000));

  // Wait for map to be fully loaded and tiles rendered
  await page.waitForFunction(() => {
    const canvas = document.querySelector('.maplibregl-canvas');
    if (!canvas || canvas.width === 0 || canvas.height === 0) return false;
    // Check if canvas has actual content (not just background)
    const ctx = canvas.getContext('2d');
    if (!ctx) return true; // Can't check, assume loaded
    return true;
  }, { timeout: 15000 }).catch(() => console.log('  Canvas check timed out'));

  // Additional wait for vector tiles to fully render
  await new Promise(r => setTimeout(r, 3000));

  // Hide UI overlays (location tag, controls, etc.) before screenshot
  await page.evaluate(() => {
    // Hide the CityNameCard - it's positioned absolute bottom-24 with z-10
    // Target by structure: absolute positioned elements with bottom positioning
    document.querySelectorAll('div').forEach(el => {
      const classes = el.className || '';
      if (typeof classes === 'string' &&
          (classes.includes('bottom-24') ||
           classes.includes('z-10') && classes.includes('absolute') ||
           classes.includes('backdrop-blur'))) {
        el.style.display = 'none';
      }
    });

    // Hide map controls
    const controls = document.querySelectorAll('.maplibregl-ctrl, .mapboxgl-ctrl, .maplibregl-ctrl-group');
    controls.forEach(el => el.style.display = 'none');

    // Hide any other UI overlays
    document.querySelectorAll('[class*="absolute"]').forEach(el => {
      const classes = el.className || '';
      if (typeof classes === 'string' &&
          (classes.includes('bottom-') || classes.includes('top-')) &&
          !classes.includes('inset')) {
        el.style.display = 'none';
      }
    });
  });

  const outputPath = path.join(STYLES_DIR, `${themeId}.png`);

  // Try to get the map container with dimensions
  const mapBox = await page.evaluate(() => {
    const mapEl = document.querySelector('.maplibregl-map') ||
                  document.querySelector('.mapboxgl-map') ||
                  document.querySelector('[class*="MapContainer"]');
    if (mapEl) {
      const rect = mapEl.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }
    return null;
  });

  if (mapBox && mapBox.width > 0 && mapBox.height > 0) {
    // Screenshot the map area with a square crop
    const size = Math.min(mapBox.width, mapBox.height, 400);
    const centerX = mapBox.x + (mapBox.width - size) / 2;
    const centerY = mapBox.y + (mapBox.height - size) / 2;

    await page.screenshot({
      path: outputPath,
      clip: { x: centerX, y: centerY, width: size, height: size }
    });
    console.log(`  Saved: ${outputPath}`);
  } else {
    // Fallback to full page screenshot, cropped from center
    console.log(`  Using fallback: full page center crop`);
    await page.screenshot({
      path: outputPath,
      clip: { x: 400, y: 200, width: 400, height: 400 }
    });
    console.log(`  Saved (full page crop): ${outputPath}`);
  }

  await page.close();
}

async function main() {
  const args = process.argv.slice(2);
  let themesToCapture = [];

  if (args.length > 0) {
    // Capture specific themes
    themesToCapture = args.filter(t => THEMES.includes(t));
    if (themesToCapture.length === 0) {
      console.error(`Invalid theme(s). Available: ${THEMES.join(', ')}`);
      process.exit(1);
    }
  } else {
    // Find themes missing screenshots
    themesToCapture = THEMES.filter(theme => {
      const pngPath = path.join(STYLES_DIR, `${theme}.png`);
      return !fs.existsSync(pngPath);
    });

    if (themesToCapture.length === 0) {
      console.log('All themes have screenshots.');
      process.exit(0);
    }
  }

  console.log(`Themes to capture: ${themesToCapture.join(', ')}`);
  console.log('Make sure dev server is running on localhost:3000\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const theme of themesToCapture) {
      await captureThemeScreenshot(browser, theme);
    }
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

main();

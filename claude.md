# 🌍 City Wallpaper Generator — Web-First claude.md
## (Cartogram+ Killer Edition)

---

## 1. Product Positioning

This is a **web-first wallpaper generator** that allows users to select any city or place on a map
and generate **premium, artistic, device-perfect wallpapers**.

This product intentionally **improves upon what Cartogram does**, by:
- Being web-based (no install required)
- Supporting **all devices**, not just phones
- Offering **AI-enhanced styles**
- Enabling instant sharing & SEO-friendly city pages
- Removing mobile OS limitations

**Goal:** Become the #1 web destination for personalized city wallpapers.

---

## 2. Competitive Benchmark (Cartogram)

### What Cartogram Does Well
- Location-based map wallpapers
- Clean minimalist styles
- Simple UX
- Mobile-first experience

### Where Cartogram Falls Short
- Mobile-only (Android-heavy)
- Phone wallpapers only
- No desktop / ultra-wide support
- No AI or cinematic styles
- No shareable web links
- Limited monetization flexibility

**This app explicitly targets these gaps.**

---

## 3. Core User Flow (Web-Optimized)

1. User lands on homepage or SEO city page
2. User searches or clicks a location on the map
3. User customizes:
   - Style
   - Zoom / angle
   - Color mode
4. User selects device(s):
   - Phone
   - Tablet
   - Desktop
   - Ultra-wide
5. Wallpapers are generated
6. User downloads or shares link

No login required for first use.

---

## 4. Map Interaction (Improved Over Cartogram)

- Interactive web map (pan / zoom / rotate / pitch)
- City search + free click
- Manual fine-tuning controls:
  - Zoom level
  - Rotation
  - Tilt
- Grid overlay toggle (for better cropping)

Captured parameters:
```json
{
  "lat": 25.2048,
  "lng": 55.2708,
  "zoom": 13.5,
  "bearing": 135,
  "pitch": 45
}
```

---

## 5. Style Engine (Major Upgrade)

Styles are **not static themes**.
They are **parameterized rendering profiles**.

Initial styles:
- Minimal Lines (Cartogram-compatible)
- Dark Mode City
- Luxury Monochrome
- Neon Cyber City
- Topographic Gold
- Cinematic Night (AI-enhanced)

Each style defines:
```json
{
  "id": "luxury-monochrome",
  "map_style": "custom-json",
  "ai_enhance": false,
  "contrast": 1.4,
  "grain": false,
  "accent_color": "#C9A24D"
}
```

---

## 6. Hybrid Rendering Pipeline (Web Advantage)

```
Map Snapshot → Style Render → (Optional) AI Enhancement →
Super-Resolution → Device Cropping → CDN Delivery
```

### Why Hybrid?
- Preserves geographic accuracy (better than pure AI)
- Adds premium feel Cartogram lacks
- Keeps generation fast enough for web

AI is **opt-in**, not default.

---

## 7. Device-Perfect Output (Key Differentiator)

Cartogram only targets phones.
This app supports **all screen classes**.

| Device | Resolution |
|------|------------|
| iPhone | 1170×2532 |
| Android | 1440×3200 |
| Tablet | 2048×2732 |
| Desktop | 3840×2160 |
| Ultra-wide | 5120×1440 |

Cropping rules:
- Landmark-aware
- Center-weighted
- No clipped roads or labels
- Deterministic results

---

## 8. SEO & Sharing (Web-Only Advantage)

Every wallpaper generates:
- A shareable URL
- An SEO-indexable page

Example:
```
/city/dubai
/city/tokyo/cinematic-night
/city/new-york/minimal-lines
```

Pages include:
- Static preview
- Download CTA
- Style switcher
- Social metadata

This is **impossible for mobile-only competitors**.

---

## 9. Monetization Strategy (Better Than App Stores)

### Free
- 1 city
- 1 style
- Phone resolution
- Watermark

### Pro (Web)
- Unlimited cities
- All styles
- All devices
- No watermark
- Faster queue

No app store tax.
Paddle only.

---

## 10. Performance Targets (Web Reality)

- First preview < 3s
- Full generation < 25s
- CDN delivery < 500ms
- Mobile web fully supported

---

## 11. Backend Responsibilities

- Generation queue
- Deterministic rendering
- Asset storage
- Signed download URLs
- Rate limiting (abuse prevention)

Job example:
```json
{
  "location": { "lat": 35.6762, "lng": 139.6503 },
  "style": "minimal-lines",
  "devices": ["desktop", "ultrawide"],
  "ai": false
}
```

---

## 12. Explicit Non-Goals (Clarity)

This app will NOT:
- Track live location
- Generate live wallpapers
- Require login to try
- Depend on mobile OS APIs

Simplicity wins.

---

## 13. Success Metrics

- Time to first wallpaper
- Downloads per session
- City page SEO traffic
- Free → Pro conversion
- Repeat city generation

---

## 14. Design Philosophy

- Web-first
- Zero friction
- Map is the hero
- Premium without complexity
- Faster than Cartogram

---

## 15. Claude Instructions

When extending this app:
- Always benchmark against Cartogram
- Prefer web-native solutions
- Avoid mobile-only assumptions
- Optimize for shareability
- Ship fast, iterate faster

---

End of claude.md

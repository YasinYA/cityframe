# CityFrame

A web-first wallpaper generator that creates premium, artistic, device-perfect wallpapers from any city or place on a map.

## Features

- Interactive map-based location selection
- 20+ premium map styles
- Support for all devices (iPhone, Android, Tablet, Desktop, Ultra-wide)
- AI-enhanced upscaling with Real-ESRGAN
- One-time purchase, lifetime access

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Maps**: MapLibre GL
- **Database**: PostgreSQL with Drizzle ORM
- **Queue**: BullMQ with Redis
- **Payments**: Polar.sh
- **Auth**: Better Auth
- **Testing**: Vitest + React Testing Library

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |

## Tests

![Tests](https://img.shields.io/badge/tests-87%20passed-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-API%20routes%2080%25+-blue)

### Test Suites

| Suite | Tests | Coverage |
|-------|-------|----------|
| **Payment Integration** | | |
| `api/polar/status` | 7 | 100% |
| `api/polar/price` | 3 | 47% |
| `hooks/useSubscription` | 4 | 85% |
| `PricingCards` | 10 | 81% |
| **Wallpaper Generation** | | |
| `api/generate-wallpaper` | 10 | 84% |
| `api/generate` | 17 | 86% |
| `api/status/[jobId]` | 7 | 100% |
| `api/download/[jobId]` | 9 | 97% |
| `GenerateButton` | 20 | 70% |

### Running Tests

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run with coverage
npm run test:coverage
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL=

# Redis
REDIS_URL=

# Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# Polar (Payments)
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
POLAR_PRODUCT_ID=

# AI Upscaling (Optional)
REPLICATE_API_TOKEN=

# Analytics (Optional)
NEXT_PUBLIC_MIXPANEL_TOKEN=
```

## License

MIT

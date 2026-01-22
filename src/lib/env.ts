const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_URL',
] as const;

const optionalEnvVars = [
  'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN',
  'REPLICATE_API_TOKEN',
  'POLAR_ACCESS_TOKEN',
  'POLAR_WEBHOOK_SECRET',
  'POLAR_PRODUCT_ID',
  'NEXT_PUBLIC_POLAR_PRODUCT_ID',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'NEXT_PUBLIC_APP_URL',
] as const;

export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function getEnvStatus(): Record<string, boolean> {
  const status: Record<string, boolean> = {};

  for (const envVar of requiredEnvVars) {
    status[envVar] = !!process.env[envVar];
  }

  for (const envVar of optionalEnvVars) {
    status[envVar] = !!process.env[envVar];
  }

  return status;
}

export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_URL: process.env.REDIS_URL!,

  // Optional services
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
  RESEND_API_KEY: process.env.RESEND_API_KEY,

  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

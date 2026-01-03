const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_URL',
  'S3_ENDPOINT',
  'S3_ACCESS_KEY',
  'S3_SECRET_KEY',
  'S3_BUCKET',
] as const;

const optionalEnvVars = [
  'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN',
  'REPLICATE_API_TOKEN',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_PRO_PRICE_ID',
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

  // S3/MinIO
  S3_ENDPOINT: process.env.S3_ENDPOINT!,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY!,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY!,
  S3_BUCKET: process.env.S3_BUCKET || 'cityframe-wallpapers',

  // Optional services
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,

  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

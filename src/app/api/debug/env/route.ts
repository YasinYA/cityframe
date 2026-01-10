import { NextResponse } from "next/server";
import { getEnvStatus } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = getEnvStatus();

  // Group by category for easier reading
  const grouped = {
    required: {
      DATABASE_URL: status.DATABASE_URL,
      REDIS_URL: status.REDIS_URL,
      S3_ENDPOINT: status.S3_ENDPOINT,
      S3_ACCESS_KEY: status.S3_ACCESS_KEY,
      S3_SECRET_KEY: status.S3_SECRET_KEY,
      S3_BUCKET: status.S3_BUCKET,
    },
    paddle: {
      PADDLE_API_KEY: status.PADDLE_API_KEY,
      PADDLE_WEBHOOK_SECRET: status.PADDLE_WEBHOOK_SECRET,
      PADDLE_PRO_PRICE_ID: status.PADDLE_PRO_PRICE_ID,
      NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: status.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
    },
    optional: {
      NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: status.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      REPLICATE_API_TOKEN: status.REPLICATE_API_TOKEN,
      RESEND_API_KEY: status.RESEND_API_KEY,
      RESEND_FROM_EMAIL: status.RESEND_FROM_EMAIL,
      NEXT_PUBLIC_APP_URL: status.NEXT_PUBLIC_APP_URL,
    },
  };

  const missingRequired = Object.entries(grouped.required)
    .filter(([, set]) => !set)
    .map(([key]) => key);

  const missingPaddle = Object.entries(grouped.paddle)
    .filter(([, set]) => !set)
    .map(([key]) => key);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    summary: {
      requiredOk: missingRequired.length === 0,
      paddleOk: missingPaddle.length === 0,
      missingRequired,
      missingPaddle,
    },
    details: grouped,
  });
}

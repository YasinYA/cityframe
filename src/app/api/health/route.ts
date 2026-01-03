import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { validateEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, { status: "ok" | "error"; message?: string }> = {};

  // Check environment variables
  const envValidation = validateEnv();
  checks.env = envValidation.valid
    ? { status: "ok" }
    : { status: "error", message: `Missing: ${envValidation.missing.join(", ")}` };

  // Check database connection
  try {
    await db.execute(sql`SELECT 1`);
    checks.database = { status: "ok" };
  } catch (error) {
    checks.database = {
      status: "error",
      message: error instanceof Error ? error.message : "Connection failed",
    };
  }

  // Check Redis connection
  try {
    const Redis = (await import("ioredis")).default;
    const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: 1 });
    await redis.ping();
    await redis.quit();
    checks.redis = { status: "ok" };
  } catch (error) {
    checks.redis = {
      status: "error",
      message: error instanceof Error ? error.message : "Connection failed",
    };
  }

  // Check MinIO/S3 connection
  try {
    const { S3Client, ListBucketsCommand } = await import("@aws-sdk/client-s3");
    const s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
      forcePathStyle: true,
    });
    await s3Client.send(new ListBucketsCommand({}));
    checks.storage = { status: "ok" };
  } catch (error) {
    checks.storage = {
      status: "error",
      message: error instanceof Error ? error.message : "Connection failed",
    };
  }

  const allHealthy = Object.values(checks).every((c) => c.status === "ok");

  return NextResponse.json(
    {
      status: allHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allHealthy ? 200 : 503 }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db/client";
import { jobs } from "@/lib/db/schema";
import { addGenerationJob } from "@/lib/queue/bullmq";
import { MapLocation, DeviceType, AIOptions } from "@/types";
import { auth } from "@/lib/auth";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/redis/rateLimit";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// Rate limit: 10 generations per user per hour
const USER_RATE_LIMIT = {
  maxRequests: 10,
  windowSeconds: 3600, // 1 hour
  prefix: "ratelimit:generate:user",
};

// Rate limit: 30 generations per IP per hour (to prevent abuse from shared IPs)
const IP_RATE_LIMIT = {
  maxRequests: 30,
  windowSeconds: 3600,
  prefix: "ratelimit:generate:ip",
};

interface GenerateRequestBody {
  location: MapLocation;
  style: string;
  devices: DeviceType[];
  ai?: AIOptions;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") ||
               "unknown";

    // Check IP rate limit first
    const ipLimit = await checkRateLimit(ip, IP_RATE_LIMIT);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many generation requests. Please try again later." },
        { status: 429, headers: getRateLimitHeaders(ipLimit) }
      );
    }

    // Check authentication - require sign-in to generate
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to generate wallpapers." },
        { status: 401 }
      );
    }

    // Check user-specific rate limit
    const userLimit = await checkRateLimit(session.user.email, USER_RATE_LIMIT);
    if (!userLimit.allowed) {
      return NextResponse.json(
        { error: "You've reached the hourly generation limit. Please try again later." },
        { status: 429, headers: getRateLimitHeaders(userLimit) }
      );
    }

    const body: GenerateRequestBody = await request.json();
    const { location, style, devices, ai } = body;

    // Validate required fields
    if (!location || !style || !devices || devices.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: location, style, devices" },
        { status: 400 }
      );
    }

    // Validate location
    if (
      typeof location.lat !== "number" ||
      typeof location.lng !== "number" ||
      typeof location.zoom !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid location format" },
        { status: 400 }
      );
    }

    // Create job in database
    const jobId = uuidv4();
    await db.insert(jobs).values({
      id: jobId,
      userId: session.user.id,
      status: "pending",
      location: {
        lat: location.lat,
        lng: location.lng,
        zoom: location.zoom,
        bearing: location.bearing || 0,
        pitch: location.pitch || 0,
      },
      style,
      devices,
      aiEnabled: ai?.enabled || false,
    });

    // Add job to queue
    await addGenerationJob({
      jobId,
      location,
      style,
      devices,
      ai,
    });

    return NextResponse.json({
      jobId,
      status: "pending",
      message: ai?.enabled
        ? "Wallpaper generation started with AI enhancement"
        : "Wallpaper generation started",
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to start generation" },
      { status: 500 }
    );
  }
}

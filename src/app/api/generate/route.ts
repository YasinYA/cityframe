import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db/client";
import { jobs } from "@/lib/db/schema";
import { addGenerationJob } from "@/lib/queue/bullmq";
import { MapLocation, DeviceType, AIOptions } from "@/types";

interface GenerateRequestBody {
  location: MapLocation;
  style: string;
  devices: DeviceType[];
  ai?: AIOptions;
}

export async function POST(request: NextRequest) {
  try {
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

    // Generate session ID for anonymous users
    const sessionId = request.cookies.get("session_id")?.value || uuidv4();

    // Create job in database
    const jobId = uuidv4();
    await db.insert(jobs).values({
      id: jobId,
      sessionId,
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

    // Create response with session cookie
    const response = NextResponse.json({
      jobId,
      status: "pending",
      message: ai?.enabled
        ? "Wallpaper generation started with AI enhancement"
        : "Wallpaper generation started",
    });

    // Set session cookie if not exists
    if (!request.cookies.get("session_id")) {
      response.cookies.set("session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to start generation" },
      { status: 500 }
    );
  }
}

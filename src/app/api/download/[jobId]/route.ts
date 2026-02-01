import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/lib/db/client";
import { jobs, images } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const device = request.nextUrl.searchParams.get("device");
    const download = request.nextUrl.searchParams.get("download") === "true";

    // Get job from database
    const job = await db.query.jobs.findFirst({
      where: eq(jobs.id, jobId),
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Authorization check: verify job ownership
    // Jobs with userId require authentication and ownership verification
    if (job.userId) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      if (job.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }
    }
    // Note: Jobs without userId (legacy/anonymous) remain accessible
    // This maintains backward compatibility

    if (job.status !== "completed") {
      return NextResponse.json(
        { error: "Job not completed yet" },
        { status: 400 }
      );
    }

    // Get images for this job
    let query = eq(images.jobId, jobId);
    if (device) {
      query = and(query, eq(images.device, device))!;
    }

    const imgs = await db.query.images.findMany({
      where: query,
    });

    if (imgs.length === 0) {
      return NextResponse.json(
        { error: "No images found for this job" },
        { status: 404 }
      );
    }

    // If download=true and single device specified, return the image directly
    if (download && device && imgs.length === 1) {
      const img = imgs[0];
      const buffer = Buffer.from(img.imageData, "base64");

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="wallpaper-${device}-${img.width}x${img.height}.png"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    }

    // Return download info with data URLs
    const downloads = imgs.map((img) => ({
      device: img.device,
      width: img.width,
      height: img.height,
      dataUrl: `data:image/png;base64,${img.imageData}`,
    }));

    return NextResponse.json({
      jobId,
      downloads,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to get downloads" },
      { status: 500 }
    );
  }
}

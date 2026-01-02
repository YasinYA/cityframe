import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { jobs, images } from "@/lib/db/schema";
import { getSignedDownloadUrl } from "@/lib/storage/s3";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const device = request.nextUrl.searchParams.get("device");

    // Get job from database
    const job = await db.query.jobs.findFirst({
      where: eq(jobs.id, jobId),
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

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

    // Generate signed URLs for each image
    const downloads = await Promise.all(
      imgs.map(async (img) => ({
        device: img.device,
        width: img.width,
        height: img.height,
        url: await getSignedDownloadUrl(img.storageKey, 3600), // 1 hour expiry
      }))
    );

    return NextResponse.json({
      jobId,
      downloads,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to generate download links" },
      { status: 500 }
    );
  }
}

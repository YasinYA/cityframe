import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { jobs, images } from "@/lib/db/schema";
import { getQueueJob } from "@/lib/queue/bullmq";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    // Get job from database
    const job = await db.query.jobs.findFirst({
      where: eq(jobs.id, jobId),
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Get generated images if completed
    let generatedImages: Array<{
      device: string;
      width: number;
      height: number;
    }> = [];

    if (job.status === "completed") {
      const imgs = await db.query.images.findMany({
        where: eq(images.jobId, jobId),
      });
      generatedImages = imgs.map((img) => ({
        device: img.device,
        width: img.width,
        height: img.height,
      }));
    }

    // Get queue progress if processing
    let progress = 0;
    if (job.status === "processing") {
      const queueJob = await getQueueJob(jobId);
      if (queueJob) {
        progress = queueJob.progress as number || 0;
      }
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      progress,
      style: job.style,
      devices: job.devices,
      images: generatedImages,
      error: job.errorMessage,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}

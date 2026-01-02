import { Job } from "bullmq";
import { eq } from "drizzle-orm";
import {
  createGenerationWorker,
  GenerationJobData,
} from "../src/lib/queue/bullmq";
import { db } from "../src/lib/db/client";
import { jobs, images } from "../src/lib/db/schema";
import {
  generateWallpapers,
  closeBrowser,
} from "../src/lib/generation/pipeline";
import { uploadImage, generateStorageKey, getSignedDownloadUrl } from "../src/lib/storage/s3";
import { enhanceImage, isAIAvailable } from "../src/lib/ai/enhance";

console.log("Starting wallpaper generation worker...");

const worker = createGenerationWorker(async (job: Job<GenerationJobData>) => {
  const { jobId, location, style, devices, ai } = job.data;

  console.log(`Processing job ${jobId}: ${style} for ${devices.join(", ")}`);
  if (ai?.enabled) {
    console.log(`AI enhancement enabled: upscale=${ai.upscale}, enhanceStyle=${ai.enhanceStyle}`);
  }

  try {
    // Update job status to processing
    await db
      .update(jobs)
      .set({ status: "processing" })
      .where(eq(jobs.id, jobId));

    // Generate wallpapers
    const wallpapers = await generateWallpapers(location, style, devices);

    // Process each wallpaper
    for (const wallpaper of wallpapers) {
      let finalBuffer = wallpaper.buffer;
      let finalWidth = wallpaper.width;
      let finalHeight = wallpaper.height;

      // Apply AI enhancement if enabled and available
      if (ai?.enabled && isAIAvailable()) {
        console.log(`Applying AI enhancement to ${wallpaper.device}...`);

        // First, upload the base image to get a URL for the AI service
        const tempKey = `temp/${jobId}/${wallpaper.device}-base.png`;
        await uploadImage(tempKey, wallpaper.buffer);
        const tempUrl = await getSignedDownloadUrl(tempKey);

        // Run AI enhancement
        const enhancementResult = await enhanceImage({
          style,
          imageUrl: tempUrl,
          upscale: ai.upscale,
          upscaleFactor: ai.upscaleFactor,
          enhanceStyle: ai.enhanceStyle,
        });

        if (enhancementResult.success && enhancementResult.imageUrl) {
          console.log(`AI enhancement successful for ${wallpaper.device}`);

          // Download the enhanced image
          const response = await fetch(enhancementResult.imageUrl);
          const arrayBuffer = await response.arrayBuffer();
          finalBuffer = Buffer.from(arrayBuffer);

          // Update dimensions if upscaled
          if (ai.upscale) {
            finalWidth = wallpaper.width * ai.upscaleFactor;
            finalHeight = wallpaper.height * ai.upscaleFactor;
          }
        } else {
          console.warn(
            `AI enhancement failed for ${wallpaper.device}: ${enhancementResult.error}`
          );
          // Continue with original image
        }
      }

      // Upload final wallpaper
      const storageKey = generateStorageKey(jobId, wallpaper.device, style);
      await uploadImage(storageKey, finalBuffer);

      await db.insert(images).values({
        jobId,
        device: wallpaper.device,
        storageKey,
        width: finalWidth,
        height: finalHeight,
      });

      console.log(
        `Uploaded ${wallpaper.device}: ${finalWidth}x${finalHeight}${ai?.enabled ? " (AI enhanced)" : ""}`
      );
    }

    // Update job status to completed
    await db
      .update(jobs)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(jobs.id, jobId));

    console.log(`Job ${jobId} completed successfully`);
  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);

    // Update job status to failed
    await db
      .update(jobs)
      .set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      })
      .where(eq(jobs.id, jobId));

    throw error;
  }
});

// Handle worker events
worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});

// Graceful shutdown
async function shutdown() {
  console.log("Shutting down worker...");
  await worker.close();
  await closeBrowser();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

console.log("Worker is running and waiting for jobs...");

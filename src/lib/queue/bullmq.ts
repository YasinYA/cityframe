import { Queue, Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { MapLocation, DeviceType, AIOptions } from "@/types";

// Redis connection
const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

// Job data type
export interface GenerationJobData {
  jobId: string;
  location: MapLocation;
  style: string;
  devices: DeviceType[];
  ai?: AIOptions;
}

// Queue name
const QUEUE_NAME = "wallpaper-generation";

// Create the queue
export const generationQueue = new Queue<GenerationJobData>(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
      count: 100,
    },
    removeOnFail: {
      age: 86400, // Keep failed jobs for 24 hours
    },
  },
});

// Add a job to the queue
export async function addGenerationJob(data: GenerationJobData): Promise<Job<GenerationJobData>> {
  return generationQueue.add("generate", data, {
    jobId: data.jobId,
  });
}

// Get job by ID
export async function getQueueJob(jobId: string): Promise<Job<GenerationJobData> | undefined> {
  return generationQueue.getJob(jobId);
}

// Create worker (used in worker process)
export function createGenerationWorker(
  processor: (job: Job<GenerationJobData>) => Promise<void>
): Worker<GenerationJobData> {
  return new Worker<GenerationJobData>(QUEUE_NAME, processor, {
    connection,
    concurrency: 2, // Process 2 jobs at a time
  });
}

// Cleanup function
export async function closeQueue(): Promise<void> {
  await generationQueue.close();
  await connection.quit();
}

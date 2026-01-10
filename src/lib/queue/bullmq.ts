import { Queue, Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { MapLocation, DeviceType, AIOptions } from "@/types";

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

// Lazy Redis connection - only connect when needed, not at import time
// This prevents build-time errors when Redis isn't accessible
let _connection: IORedis | null = null;
let _queue: Queue<GenerationJobData> | null = null;

function getConnection(): IORedis {
  if (!_connection) {
    _connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: null,
    });
  }
  return _connection;
}

function getQueue(): Queue<GenerationJobData> {
  if (!_queue) {
    _queue = new Queue<GenerationJobData>(QUEUE_NAME, {
      connection: getConnection(),
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
  }
  return _queue;
}

// Add a job to the queue
export async function addGenerationJob(data: GenerationJobData): Promise<Job<GenerationJobData>> {
  return getQueue().add("generate", data, {
    jobId: data.jobId,
  });
}

// Get job by ID
export async function getQueueJob(jobId: string): Promise<Job<GenerationJobData> | undefined> {
  return getQueue().getJob(jobId);
}

// Create worker (used in worker process)
export function createGenerationWorker(
  processor: (job: Job<GenerationJobData>) => Promise<void>
): Worker<GenerationJobData> {
  return new Worker<GenerationJobData>(QUEUE_NAME, processor, {
    connection: getConnection(),
    concurrency: 2, // Process 2 jobs at a time
  });
}

// Cleanup function
export async function closeQueue(): Promise<void> {
  if (_queue) {
    await _queue.close();
  }
  if (_connection) {
    await _connection.quit();
  }
}

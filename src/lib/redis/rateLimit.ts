import { getRedis } from "./client";

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Optional prefix for the rate limit key */
  prefix?: string;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Number of remaining requests in the current window */
  remaining: number;
  /** Timestamp when the rate limit resets (Unix seconds) */
  resetAt: number;
  /** Total limit */
  limit: number;
}

// In-memory fallback rate limiter when Redis is unavailable
// Uses a simple sliding window with Map storage
const memoryStore = new Map<string, { count: number; windowStart: number }>();

// Cleanup old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupMemoryStore(windowSeconds: number): void {
  const now = Math.floor(Date.now() / 1000);
  const cutoff = now - windowSeconds * 2; // Keep entries for 2x window to be safe

  for (const [key, value] of memoryStore.entries()) {
    if (value.windowStart < cutoff) {
      memoryStore.delete(key);
    }
  }
}

function checkMemoryRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const { maxRequests, windowSeconds, prefix = "ratelimit" } = config;
  const key = `${prefix}:${identifier}`;
  const now = Math.floor(Date.now() / 1000);

  // Periodic cleanup
  if (Date.now() - lastCleanup > CLEANUP_INTERVAL) {
    cleanupMemoryStore(windowSeconds);
    lastCleanup = Date.now();
  }

  const existing = memoryStore.get(key);

  if (!existing || existing.windowStart < now - windowSeconds) {
    // New window
    memoryStore.set(key, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: now + windowSeconds,
      limit: maxRequests,
    };
  }

  // Existing window - increment count
  existing.count += 1;
  const allowed = existing.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - existing.count);

  return {
    allowed,
    remaining,
    resetAt: existing.windowStart + windowSeconds,
    limit: maxRequests,
  };
}

/**
 * Check rate limit using Redis sliding window with in-memory fallback
 * @param identifier - Unique identifier for the rate limit (e.g., IP, email, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedis();
  const { maxRequests, windowSeconds, prefix = "ratelimit" } = config;
  const key = `${prefix}:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - windowSeconds;

  try {
    // Use a Redis transaction for atomic operations
    const pipeline = redis.pipeline();

    // Remove old entries outside the window
    pipeline.zremrangebyscore(key, "-inf", windowStart);

    // Count current requests in window
    pipeline.zcard(key);

    // Add current request with timestamp as score
    pipeline.zadd(key, now.toString(), `${now}:${Math.random()}`);

    // Set expiry on the key
    pipeline.expire(key, windowSeconds);

    const results = await pipeline.exec();

    if (!results) {
      // Redis error - use in-memory fallback
      console.warn("[RateLimit] Redis returned null, using memory fallback");
      return checkMemoryRateLimit(identifier, config);
    }

    // Get count from zcard result (index 1, value at index 1)
    const currentCount = (results[1]?.[1] as number) || 0;
    const allowed = currentCount < maxRequests;
    const remaining = Math.max(0, maxRequests - currentCount - 1);

    return {
      allowed,
      remaining: allowed ? remaining : 0,
      resetAt: now + windowSeconds,
      limit: maxRequests,
    };
  } catch (error) {
    console.error("Rate limit check failed, using memory fallback:", error);
    // Use in-memory fallback instead of failing open
    return checkMemoryRateLimit(identifier, config);
  }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.resetAt.toString(),
  };
}

/**
 * Reset rate limit for an identifier (useful for testing or admin actions)
 */
export async function resetRateLimit(
  identifier: string,
  prefix = "ratelimit"
): Promise<void> {
  const redis = getRedis();
  const key = `${prefix}:${identifier}`;

  try {
    await redis.del(key);
  } catch {
    // Also clear from memory store
  }

  // Always clear from memory store
  memoryStore.delete(key);
}

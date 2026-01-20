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

/**
 * Check rate limit using Redis sliding window
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
      // Redis error - fail open (allow request)
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetAt: now + windowSeconds,
        limit: maxRequests,
      };
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
    console.error("Rate limit check failed:", error);
    // Fail open - allow request if Redis is down
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: now + windowSeconds,
      limit: maxRequests,
    };
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
  await redis.del(key);
}

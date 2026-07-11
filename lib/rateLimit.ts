/**
 * Lightweight in-memory rate limiter — sliding window per key.
 *
 * IMPORTANT LIMITATION: state lives in this Node process's memory. That's
 * fine for a single self-hosted server (matches your Ubuntu VPS setup), but
 * if you ever run multiple instances behind a load balancer, or deploy to a
 * serverless platform, each instance gets its own counters and this stops
 * being an accurate global limit. At that point, swap the Map below for
 * Redis/Upstash (same interface, same call sites).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodic cleanup so `buckets` doesn't grow forever under sustained traffic.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

/**
 * @param key unique identifier for this limit — usually `${ip}:${route}`
 * @param limit max requests allowed within the window
 * @param windowMs window size in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  cleanup();

  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, limit, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { success: false, limit, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { success: true, limit, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/** Best-effort client IP extraction behind a reverse proxy (Nginx, etc). */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

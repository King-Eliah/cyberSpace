// Rate limiting is optional — skipped when Upstash credentials are not set.
// For production, add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.

let ratelimitModule: typeof import("@upstash/ratelimit") | null = null;
let redisModule: typeof import("@upstash/redis") | null = null;

async function getModules() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!ratelimitModule) {
    ratelimitModule = await import("@upstash/ratelimit");
    redisModule = await import("@upstash/redis");
  }
  return { Ratelimit: ratelimitModule.Ratelimit, Redis: redisModule!.Redis };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RateLimiterHandle = any;

export async function createRateLimiterIfConfigured(
  requests: number,
  windowInSeconds: number
): Promise<RateLimiterHandle | null> {
  const modules = await getModules();
  if (!modules) return null;
  const redis = new modules.Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  return new modules.Ratelimit({
    redis,
    limiter: modules.Ratelimit.slidingWindow(requests, `${windowInSeconds} s`),
    analytics: false,
  });
}

export async function checkRateLimit(
  limiter: RateLimiterHandle | null,
  identifier: string
): Promise<{ success: boolean; remaining: number; reset: Date }> {
  if (!limiter) {
    return { success: true, remaining: 99, reset: new Date() };
  }
  const { success, remaining, reset } = await limiter.limit(identifier);
  return { success, remaining, reset: new Date(reset) };
}

// Pre-built limiters (lazy, optional)
export const linkedinRateLimiter = null as RateLimiterHandle | null;
export const briefRateLimiter = null as RateLimiterHandle | null;
export const applicationDraftRateLimiter = null as RateLimiterHandle | null;

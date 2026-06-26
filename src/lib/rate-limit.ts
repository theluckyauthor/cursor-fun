interface RateEntry {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 5 * 60 * 1000;
const MAX_PER_WINDOW = 1;

const buckets = new Map<string, RateEntry>();

/**
 * Best-effort, in-memory per-identifier rate limit. On serverless this is
 * per-instance only, so the client-side cooldown is the primary guard; this
 * catches rapid retries that hit the same warm instance.
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  retryAfterMs: number;
} {
  const now = Date.now();
  const entry = buckets.get(identifier);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    buckets.set(identifier, { count: 1, windowStart: now });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= MAX_PER_WINDOW) {
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - entry.windowStart) };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

export const COOLDOWN_MS = WINDOW_MS;

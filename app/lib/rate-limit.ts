import { NextResponse } from 'next/server';
import Redis from 'ioredis';

declare global {
  var __rateRedis: Redis | undefined;
}

let redis: Redis | undefined = globalThis.__rateRedis;

if (!globalThis.__rateRedis) {
  const url = process.env.REDIS_URL;
  if (url) {
    try {
      redis = new Redis(url, {
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => Math.min(times * 200, 2000),
      });
      redis.on('error', () => {
        // Redis unavailable — degrade to in-memory limiting.
      });
      globalThis.__rateRedis = redis;
    } catch {
      redis = undefined;
    }
  }
}

// In-memory fallback keeps protection alive during a Redis outage or local dev.
const memoryBuckets = new Map<string, number[]>();

async function redisHit(key: string, max: number, windowMs: number): Promise<boolean> {
  if (!redis) return false;
  try {
    const n = await redis.incr(key);
    if (n === 1) {
      await redis.pexpire(key, windowMs);
    }
    return n > max;
  } catch {
    return false;
  }
}

export type RateLimitResult = NextResponse | null;

export async function rateLimit(
  request: Request,
  opts?: { windowMs?: number; max?: number; keyPrefix?: string }
): Promise<RateLimitResult> {
  const windowMs = opts?.windowMs ?? 60 * 1000;
  const max = opts?.max ?? 20;
  const prefix = opts?.keyPrefix ?? 'rl';

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const key = `${prefix}:${ip}`;

  let limited = false;

  const redisUp = redis?.status === "ready";

  if (redisUp) {
    limited = await redisHit(key, max, windowMs);
  }

  if (!redisUp) {
    const now = Date.now();
    const bucket = memoryBuckets.get(key) || [];
    const live = bucket.filter((t) => now - t < windowMs);
    if (live.length >= max) {
      limited = true;
    } else {
      live.push(now);
      memoryBuckets.set(key, live);

      if (memoryBuckets.size > 1000) {
        for (const [k, v] of memoryBuckets) {
          const l = v.filter((t) => now - t < windowMs);
          if (l.length === 0) memoryBuckets.delete(k);
          else memoryBuckets.set(k, l);
        }
      }
    }
  }

  if (limited) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  return null;
}
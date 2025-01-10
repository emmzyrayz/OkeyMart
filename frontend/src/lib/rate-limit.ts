// src/lib/rate-limit.ts
import {NextResponse} from "next/server";
import {NextRequest} from "next/server";
import {Redis} from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export const rateLimit = (config: RateLimitConfig) => {
  return async (request: NextRequest) => {
    const ip = request.ip ?? "127.0.0.1";
    const key = `rate-limit:${ip}`;

    const window = (await redis.get<number>(key)) || 0;

    if (window >= config.max) {
      return NextResponse.json(
        {message: "Too many requests from this IP. Please try again later."},
        {status: 429}
      );
    }

    await redis.incr(key);
    await redis.expire(key, config.windowMs / 1000);

    return null;
  };
};

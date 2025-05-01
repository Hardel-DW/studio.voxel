import { Redis } from "@upstash/redis";
import { type NextRequest, NextResponse } from "next/server";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
    console.error("Upstash Redis environment variables UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not set.");
}

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

// POST handler
export async function POST(request: NextRequest) {
    if (!redis) {
        console.error("Redis client is not initialized. Check environment variables.");
        return NextResponse.json(
            { error: "Redis connection not configured" },
            {
                status: 503,
                statusText: "Service Unavailable"
            }
        );
    }

    let keys: string[] | undefined;

    try {
        const body = await request.json();
        keys = body.keys;

        if (!Array.isArray(keys) || keys.length === 0 || !keys.every((k) => typeof k === "string")) {
            return NextResponse.json({ error: "Missing or invalid keys parameter (non-empty string array expected)" }, { status: 400 });
        }
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    try {
        const values = await redis.mget<Array<string | null>>(...keys);

        const translations: Record<string, string | null> = {};
        keys.forEach((key, index) => {
            if (index < values.length) {
                translations[key] = values[index];
            } else {
                translations[key] = null;
                console.warn(`Mismatch between keys length (${keys.length}) and values length (${values.length}) for key: ${key}`);
            }
        });

        return NextResponse.json(translations, { status: 200 });
    } catch (error) {
        console.error("Upstash Redis MGET error:", error);
        return NextResponse.json({ error: "Failed to fetch translations from Redis" }, { status: 500 });
    }
}

// GET handler (Health Check)
export async function GET(request: NextRequest) {
    if (!redis) {
        return NextResponse.json({ status: "Redis not configured. Check environment variables.", configured: false }, { status: 503 });
    }
    try {
        const timeResult = await redis.time();
        const isConnected = Array.isArray(timeResult) && timeResult.length === 2;
        return NextResponse.json(
            {
                status: isConnected ? "connected" : "connection failed (unexpected response)",
                time: timeResult,
                configured: true
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Upstash Redis connection test error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown connection error";
        const status =
            errorMessage.includes("Authentication required") || errorMessage.includes("Unauthorized") || (error as any)?.status === 401
                ? 401
                : 500;
        return NextResponse.json({ status: "connection failed", error: errorMessage, configured: true }, { status });
    }
}

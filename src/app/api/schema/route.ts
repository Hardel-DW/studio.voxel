import { Redis } from "@upstash/redis";
import { type NextRequest, NextResponse } from "next/server";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
    console.error("Upstash Redis environment variables UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not set.");
}

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

export async function GET(request: NextRequest) {
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

    const key = request.nextUrl.searchParams.get("key");

    if (!key) {
        return NextResponse.json({ error: "Missing 'key' query parameter" }, { status: 400 });
    }

    // Validate the format of the key
    const roadmapPattern = /^schema\.roadmap@\d+$/;
    const genericPattern = /^[a-zA-Z0-9_\-]+\.\d+@[a-zA-Z0-9_\-]+$/;

    if (!roadmapPattern.test(key) && !genericPattern.test(key)) {
        console.error(`Invalid 'key' format. Expected 'schema.roadmap@<number>' or '<string>.<number>@<string>' for key ${key}`);
        return NextResponse.json(
            {
                error: `Invalid 'key' format. Expected 'schema.roadmap@<number>' or '<string>.<number>@<string>' for key ${key}.`
            },
            {
                status: 400
            }
        );
    }

    try {
        const schemaData = await redis.get(key);

        if (schemaData === null) {
            return NextResponse.json({ error: "Schema not found for the provided key" }, { status: 404 });
        }

        // Redis client might already parse it
        if (typeof schemaData === "object" && schemaData !== null) {
            return NextResponse.json(schemaData, { status: 200 });
        }
        if (typeof schemaData === "string") {
            try {
                const schemaJson = JSON.parse(schemaData);
                return NextResponse.json(schemaJson, { status: 200 });
            } catch (parseError) {
                console.error(`Failed to parse JSON string for key ${key}:`, parseError);
                return NextResponse.json({ error: "Failed to parse schema string from Redis", rawString: schemaData }, { status: 500 });
            }
        } else {
            console.error(`Unexpected data type from Redis for key ${key}: ${typeof schemaData}`);
            return NextResponse.json({ error: "Unexpected data type received from Redis" }, { status: 500 });
        }
    } catch (error) {
        console.error(`Upstash Redis GET error for key ${key}:`, error);
        return NextResponse.json({ error: "Failed to fetch schema from Redis" }, { status: 500 });
    }
}

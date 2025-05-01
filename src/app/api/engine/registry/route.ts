import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const registry = url.searchParams.get("registry");
    if (!registry) {
        return new NextResponse("Missing registry parameter", { status: 400 });
    }

    const registryPath = registry.startsWith("tags/") ? registry.replace(/^tags\//, "tag/") : registry;

    const baseUrl = "https://raw.githubusercontent.com/misode/mcmeta/summary/data";
    const fileUrl = `${baseUrl}/${registryPath}/data.min.json`;

    const response = await fetch(fileUrl);
    if (!response.ok) {
        return new NextResponse("Tag not found", { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, {
        status: 200,
        headers: { "Cache-Control": "public, max-age=86400" }
    });
}

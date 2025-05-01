import { type NextRequest, NextResponse } from "next/server";

const MCMETA = "https://raw.githubusercontent.com/misode/mcmeta/summary";

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${MCMETA}/atlas/all/atlas.png`);

        if (!response.ok) {
            return NextResponse.json({ error: "Atlas not found" }, { status: 404 });
        }

        const buffer = await response.arrayBuffer();
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "image/png",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        console.error("Atlas endpoint error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

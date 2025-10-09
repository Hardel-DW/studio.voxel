import type { IncomingMessage, ServerResponse } from "node:http";

interface VercelRequest extends IncomingMessage {
    query: Record<string, string | string[]>;
    cookies: Record<string, string>;
    body: any;
}

interface VercelResponse extends ServerResponse {
    status: (code: number) => VercelResponse;
    json: (data: any) => VercelResponse;
    send: (data: any) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === "GET") {
        const name = req.query.name || "World";
        return res.status(200).json({
            message: `Hello ${name}!`,
            timestamp: Date.now(),
            method: "GET"
        });
    }

    if (req.method === "POST") {
        const { name } = req.body || {};
        return res.status(200).json({
            message: `Hello ${name || "Anonymous"} from POST!`,
            timestamp: Date.now(),
            method: "POST"
        });
    }

    return res.status(405).json({ error: "Method not allowed" });
}

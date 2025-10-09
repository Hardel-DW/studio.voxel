import type { IncomingMessage, ServerResponse } from "node:http";

export interface VercelRequest extends IncomingMessage {
    query: Record<string, string | string[]>;
    cookies: Record<string, string>;
    body: any;
}

export interface VercelResponse extends ServerResponse {
    status: (code: number) => VercelResponse;
    json: (data: any) => VercelResponse;
    send: (data: any) => VercelResponse;
}
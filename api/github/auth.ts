import type { VercelRequest, VercelResponse } from "@/lib/api";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const clientId = process.env.GITHUB_CLIENT;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return res.status(500).json({ error: "Missing GitHub configuration" });
    }

    const state = Math.random().toString(36).substring(7);
    const scope = "repo read:org read:user";

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;

    res.setHeader("Set-Cookie", `github_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`);
    return res.status(200).json({ url: authUrl, state });
}

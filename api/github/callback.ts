import type { VercelRequest, VercelResponse } from "@/lib/api";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { code, state } = req.query;

    if (!code || typeof code !== "string") {
        return res.status(400).json({ error: "Missing code parameter" });
    }

    const clientId = process.env.GITHUB_CLIENT;
    const clientSecret = process.env.GITHUB_SECRET;

    if (!clientId || !clientSecret) {
        return res.status(500).json({ error: "Missing GitHub configuration" });
    }

    try {
        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code
            })
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return res.status(400).json({ error: tokenData.error_description || "Failed to get access token" });
        }

        const { access_token } = tokenData;

        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Accept": "application/vnd.github+json"
            }
        });

        const userData = await userResponse.json();

        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>GitHub Authentication Success</title>
            </head>
            <body>
                <script>
                    window.opener.postMessage({
                        type: 'github-auth-success',
                        token: '${access_token}',
                        user: ${JSON.stringify({ login: userData.login, id: userData.id, avatar_url: userData.avatar_url })}
                    }, window.location.origin);
                    window.close();
                </script>
                <p>Authentication successful! You can close this window.</p>
            </body>
            </html>
        `);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/session";

function generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const initiateGitHubAuthFn = createServerFn({ method: "POST" })
    .inputValidator((data: { returnTo?: string }) => data)
    .handler(async ({ data }) => {
        const clientId = process.env.GITHUB_CLIENT;

        if (!clientId) {
            throw new Error("Missing GitHub configuration");
        }

        const state = generateRandomState();
        const session = await useAppSession();
        await session.update({
            oauthState: state,
            returnTo: data.returnTo || "/en"
        });

        const baseUrl = process.env.APP_URL || "http://localhost:5173";
        const redirectUri = `${baseUrl}/auth`;
        const scope = "repo read:org read:user";

        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;

        return { authUrl };
    });

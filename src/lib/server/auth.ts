import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/hook/useAppSession";

function generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const initiateGitHubAuthFn = createServerFn({ method: "POST" })
    .inputValidator((data: { returnTo?: string }) => data)
    .handler(async ({ data }) => {
        const clientId = process.env.GITHUB_CLIENT;
        const baseUrl = process.env.APP_URL;

        if (!clientId) {
            throw new Error("Missing GitHub configuration");
        }

        if (!baseUrl) {
            throw new Error("Missing APP_URL configuration");
        }

        const state = generateRandomState();
        const session = await useAppSession();
        await session.update({
            oauthState: state,
            returnTo: data.returnTo || "/en"
        });

        const redirectUri = `${baseUrl}/auth`;
        const scope = "repo read:org read:user";

        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;

        return { authUrl };
    });

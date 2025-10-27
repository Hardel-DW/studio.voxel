import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/hook/useAppSession";
import { z } from "@/lib/utils/validator";

function generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

type AuthInput = {
    returnTo?: string;
    isNewTab?: boolean;
};

export const initiateGitHubAuthFn = createServerFn({ method: "POST" })
    .inputValidator((data: AuthInput) =>
        z
            .object({
                returnTo: z.string().optional().description("Return URL after authentication"),
                isNewTab: z.boolean().optional().description("Whether auth is opened in new tab")
            })
            .parse(data)
    )
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
            returnTo: data.returnTo || "/en",
            isNewTab: data.isNewTab || false
        });

        const redirectUri = `${baseUrl}/auth`;
        const scope = "repo read:org read:user";

        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;

        return { authUrl };
    });

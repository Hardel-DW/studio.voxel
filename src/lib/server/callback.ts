import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/hook/useAppSession";
import { GitHub } from "../github/GitHub";

type CallbackInput = {
    code: string;
    state: string;
};

export const handleGitHubCallbackFn = createServerFn({ method: "POST" })
    .inputValidator((data: CallbackInput) => {
        if (!data.code || typeof data.code !== "string") {
            throw new Error("Missing or invalid code parameter");
        }
        if (!data.state || typeof data.state !== "string") {
            throw new Error("Missing or invalid state parameter");
        }
        return data;
    })
    .handler(async ({ data }) => {
        const session = await useAppSession();
        const sessionData = session.data;

        if (!sessionData.oauthState || sessionData.oauthState !== data.state) {
            throw new Error("Invalid OAuth state - possible CSRF attack");
        }

        const clientId = process.env.GITHUB_CLIENT;
        const clientSecret = process.env.GITHUB_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error("Missing GitHub configuration");
        }

        const github = new GitHub();
        const tokenData = await github.getAccessToken(clientId, clientSecret, data.code);
        const { access_token } = tokenData;
        if (!access_token) {
            throw new Error(`GitHub OAuth error: ${tokenData.error_description || tokenData.error || "No access token returned"}`);
        }

        const githubWithToken = new GitHub({ token: access_token });
        const { login, id, avatar_url } = await githubWithToken.getUser();
        const returnTo = sessionData.returnTo || "/en";

        await session.update({
            userId: id,
            userLogin: login,
            userAvatar: avatar_url,
            githubToken: access_token,
            oauthState: undefined,
            returnTo: undefined
        });

        return { success: true, returnTo };
    });

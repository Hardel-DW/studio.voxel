import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/hook/useAppSession";
import { z } from "@/lib/utils/validator";
import { GitHub } from "../github/GitHub";

type CallbackInput = {
    code: string;
    state: string;
};

export const handleGitHubCallbackFn = createServerFn({ method: "POST" })
    .inputValidator((data: CallbackInput) =>
        z
            .object({
                code: z.string().min(1).description("GitHub code"),
                state: z.string().min(1).description("GitHub state")
            })
            .parse(data)
    )
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
        const isNewTab = sessionData.isNewTab || false;

        await session.update({
            userId: id,
            userLogin: login,
            userAvatar: avatar_url,
            githubToken: access_token,
            oauthState: undefined,
            returnTo: undefined,
            isNewTab: undefined
        });

        return { success: true, returnTo, isNewTab };
    });

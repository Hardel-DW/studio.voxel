import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/session";
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
        const github = new GitHub({ clientId, clientSecret });

        const { access_token: token } = await github.getAccessToken(data.code);
        const githubWithToken = new GitHub({ authHeader: token as string });
        const { login, id, avatar_url } = await githubWithToken.getUser();

        const returnTo = sessionData.returnTo || "/en";

        await session.update({
            userId: id,
            userLogin: login,
            userAvatar: avatar_url,
            githubToken: token as string,
            oauthState: undefined,
            returnTo: undefined,
        });

        return { success: true, returnTo };
    });

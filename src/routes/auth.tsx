import { createFileRoute, redirect } from "@tanstack/react-router";
import { handleGitHubCallbackFn } from "@/lib/server/callback";

export const Route = createFileRoute("/auth")({
    loader: async ({ location }) => {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");
        const state = params.get("state");

        if (!code || !state) {
            throw new Error("Missing code or state parameter");
        }

        const result = await handleGitHubCallbackFn({ data: { code, state } });
        throw redirect({ to: result.returnTo });
    }
});

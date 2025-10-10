import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
    component: GitHubCallback,
    loader: async ({ location }) => {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");

        if (!code) {
            throw new Error("Missing code parameter");
        }

        const response = await fetch(`/api/github/callback?code=${code}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Authentication failed");
        }

        return data as { token: string; user: { login: string; id: number; avatar_url: string } };
    }
});

function GitHubCallback() {
    const data = Route.useLoaderData();
    if (window.opener) {
        window.opener.postMessage({ type: "github-auth-success", token: data.token, user: data.user }, window.location.origin);
        window.close();
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-200">
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-semibold">Authentication Successful!</h1>
                <p className="text-zinc-400">You can close this window.</p>
            </div>
        </div>
    );
}

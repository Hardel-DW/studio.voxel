import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
    loader: async ({ location }) => {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");

        if (!code) {
            throw new Error("Missing code parameter");
        }

        const response = await fetch(`/api/github/callback?code=${code}`, {
            credentials: "include"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Authentication failed");
        }

        const returnTo = sessionStorage.getItem("github_auth_return") || "/en";
        sessionStorage.removeItem("github_auth_return");

        throw redirect({ to: returnTo });
    }
});

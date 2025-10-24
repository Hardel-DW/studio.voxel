import { createGitHubHeaders } from "./headers";

export async function getAccessToken(
    clientId: string,
    clientSecret: string,
    code: string
): Promise<{ access_token?: string; error?: string; error_description?: string }> {
    const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: createGitHubHeaders(undefined, true),
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code
        })
    });

    if (!response.ok) {
        return {
            error: "github_api_error",
            error_description: `GitHub returned ${response.status}`
        };
    }

    return response.json();
}

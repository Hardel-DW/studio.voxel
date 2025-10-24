import { createGitHubHeaders } from "./headers";

export async function createPullRequest(
    authHeader: string,
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string,
    body: string
) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        method: "POST",
        headers: createGitHubHeaders(authHeader, true),
        body: JSON.stringify({
            title,
            head,
            base,
            body
        })
    });

    return response.json();
}

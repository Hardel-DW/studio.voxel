import { createGitHubHeaders } from "./headers";

export async function getRef(authHeader: string, owner: string, repo: string, branch: string) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, {
        headers: createGitHubHeaders(authHeader)
    });

    return response.json();
}

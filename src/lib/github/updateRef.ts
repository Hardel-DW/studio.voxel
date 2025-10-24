import { createGitHubHeaders } from "./headers";

export async function updateRef(authHeader: string, owner: string, repo: string, branch: string, sha: string) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
        method: "PATCH",
        headers: createGitHubHeaders(authHeader, true),
        body: JSON.stringify({ sha })
    });

    return response.json();
}

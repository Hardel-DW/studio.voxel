import { createGitHubHeaders } from "./headers";

export async function createRef(authHeader: string, owner: string, repo: string, branch: string, sha: string) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
        method: "POST",
        headers: createGitHubHeaders(authHeader, true),
        body: JSON.stringify({
            ref: `refs/heads/${branch}`,
            sha
        })
    });

    return response.json();
}

import { createGitHubHeaders } from "./headers";

export async function downloadRepo(authHeader: string, owner: string, repo: string, branch: string) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`, {
        headers: createGitHubHeaders(authHeader)
    });

    return response;
}

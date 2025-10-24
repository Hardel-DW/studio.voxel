import { createGitHubHeaders } from "./headers";

export async function createBlob(authHeader: string, owner: string, repo: string, content: string) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
        method: "POST",
        headers: createGitHubHeaders(authHeader, true),
        body: JSON.stringify({
            content,
            encoding: "base64"
        })
    });

    return response.json();
}

export async function updateRef(authHeader: string, owner: string, repo: string, branch: string, sha: string) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
        method: "PATCH",
        headers: {
            Authorization: authHeader,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ sha })
    });

    return response.json();
}

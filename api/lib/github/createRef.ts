export async function createRef(authHeader: string, owner: string, repo: string, branch: string, sha: string) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
        method: "POST",
        headers: {
            Authorization: authHeader,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ref: `refs/heads/${branch}`,
            sha
        })
    });

    return response.json();
}

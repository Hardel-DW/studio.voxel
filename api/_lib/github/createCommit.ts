export async function createCommit(authHeader: string, owner: string, repo: string, message: string, treeSha: string, parentSha: string) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
        method: "POST",
        headers: {
            Authorization: authHeader,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message,
            tree: treeSha,
            parents: [parentSha]
        })
    });

    return response.json();
}

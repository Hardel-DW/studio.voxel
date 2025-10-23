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
        headers: {
            Authorization: authHeader,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            head,
            base,
            body
        })
    });

    return response.json();
}

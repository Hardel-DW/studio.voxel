export async function getCommit(authHeader: string, owner: string, repo: string, commitSha: string) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${commitSha}`, {
        headers: {
            Authorization: authHeader,
            Accept: "application/vnd.github+json"
        }
    });

    return response.json();
}

type TreeItem = {
    path: string;
    mode?: string;
    type?: string;
    sha: string | null;
};

export async function createTree(authHeader: string, owner: string, repo: string, baseTreeSha: string, tree: TreeItem[]) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
        method: "POST",
        headers: {
            Authorization: authHeader,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            base_tree: baseTreeSha,
            tree
        })
    });

    return response.json();
}

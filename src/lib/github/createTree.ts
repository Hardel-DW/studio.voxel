import { createGitHubHeaders } from "./headers";

type TreeItem = {
    path: string;
    mode?: string;
    type?: string;
    sha: string | null;
};

export async function createTree(authHeader: string, owner: string, repo: string, baseTreeSha: string, tree: TreeItem[]) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
        method: "POST",
        headers: createGitHubHeaders(authHeader, true),
        body: JSON.stringify({
            base_tree: baseTreeSha,
            tree
        })
    });

    return response.json();
}

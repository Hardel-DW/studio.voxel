import { Hono } from "hono";
import { cors } from "hono/cors";
import "@voxelio/env/config";

type GitHubOrganization = {
    login: string;
    id: number;
    avatar_url: string;
    description: string;
};

type GitHubRepo = {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    owner: { login: string; avatar_url: string };
    html_url: string;
    clone_url: string;
    updated_at: string;
    default_branch: string;
};

const app = new Hono();

app.use("/api/*", cors());
app.get("/api/hello", (c) => c.json({ message: "Hello, world!", test: process.env.TEST }));

app.get("/api/github/auth", (c) => {
    const GITHUB_CLIENT = process.env.GITHUB_CLIENT;
    if (!GITHUB_CLIENT) {
        return c.json({ error: "Missing GitHub configuration" }, 500);
    }

    const baseUrl = new URL(c.req.url);
    const redirectUri = `${baseUrl.protocol}//${baseUrl.host}/auth`;
    const state = Math.random().toString(36).substring(7);
    const scope = "repo read:org read:user";
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
    c.header("Set-Cookie", `github_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`);
    return c.json({ url: authUrl, state });
});

app.get("/api/github/callback", async (c) => {
    const code = c.req.query("code");
    const GITHUB_CLIENT = process.env.GITHUB_CLIENT;
    const GITHUB_SECRET = process.env.GITHUB_SECRET;

    if (!code) {
        return c.json({ error: "Missing code parameter" }, 400);
    }

    if (!GITHUB_CLIENT || !GITHUB_SECRET) {
        return c.json({ error: "Missing GitHub configuration" }, 500);
    }

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            client_id: GITHUB_CLIENT,
            client_secret: GITHUB_SECRET,
            code
        })
    });

    const tokenData = (await tokenResponse.json()) as { access_token?: string; error?: string; error_description?: string };
    if (tokenData.error) {
        return c.json({ error: tokenData.error_description || "Failed to get access token" }, 400);
    }

    const userResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            Accept: "application/vnd.github+json"
        }
    });

    const userData = (await userResponse.json()) as { login: string; id: number; avatar_url: string };

    return c.json({
        token: tokenData.access_token,
        user: {
            login: userData.login,
            id: userData.id,
            avatar_url: userData.avatar_url
        }
    });
});

app.get("/api/github/repos", async (c) => {
    const authHeader = c.req.header("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
        return c.json({ error: "Missing authorization token" }, 401);
    }

    const [userRepos, orgs] = await Promise.all([
        fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json"
            }
        }),
        fetch("https://api.github.com/user/orgs", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json"
            }
        })
    ]);

    if (!userRepos.ok || !orgs.ok) {
        return c.json({ error: "Invalid or expired token" }, 401);
    }

    const [repositories, organizations] = (await Promise.all([userRepos.json(), orgs.json()])) as [
        Array<GitHubRepo>,
        Array<GitHubOrganization>
    ];

    const orgReposPromises = organizations.map((org) =>
        fetch(`https://api.github.com/orgs/${org.login}/repos?per_page=100&sort=updated`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json"
            }
        }).then((r) => r.json())
    );

    const orgRepos = await Promise.all(orgReposPromises);
    const allOrgRepos = orgRepos.flat();

    return c.json({
        repositories: repositories.map((repo) => transformRepo(repo)),
        organizations: organizations.map((org) => ({
            login: org.login,
            id: org.id,
            avatar_url: org.avatar_url,
            description: org.description
        })),
        orgRepositories: allOrgRepos.map((repo) => transformRepo(repo))
    });
});

app.get("/api/github/download/:owner/:repo/:branch", async (c) => {
    const authHeader = c.req.header("authorization");
    const { owner, repo, branch } = c.req.param();

    if (!authHeader) {
        return c.json({ error: "Missing authorization token" }, 401);
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`, {
        headers: {
            Authorization: authHeader,
            Accept: "application/vnd.github+json"
        }
    });

    if (!response.ok) {
        return c.json({ error: "Failed to download repository" }, 500);
    }

    const arrayBuffer = await response.arrayBuffer();
    return c.body(new Uint8Array(arrayBuffer), 200, {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${repo}.zip"`
    });
});

app.post("/api/github/push", async (c) => {
    const authHeader = c.req.header("authorization");
    if (!authHeader) {
        return c.json({ error: "Missing authorization token" }, 401);
    }

    const { owner, repo, branch, files } = await c.req.json();

    try {
        const refResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`,
            {
                headers: {
                    Authorization: authHeader,
                    Accept: "application/vnd.github+json"
                }
            }
        );
        const refData = await refResponse.json();
        const commitSha = refData.object.sha;

        const commitResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/commits/${commitSha}`,
            {
                headers: {
                    Authorization: authHeader,
                    Accept: "application/vnd.github+json"
                }
            }
        );
        const commitData = await commitResponse.json();
        const baseTreeSha = commitData.tree.sha;

        const blobPromises = Object.entries(files as Record<string, string>).map(async ([path, content]) => {
            const blobResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/git/blobs`,
                {
                    method: "POST",
                    headers: {
                        Authorization: authHeader,
                        Accept: "application/vnd.github+json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        content,
                        encoding: "base64"
                    })
                }
            );
            const blobData = await blobResponse.json();
            return {
                path,
                mode: "100644",
                type: "blob",
                sha: blobData.sha
            };
        });

        const tree = await Promise.all(blobPromises);

        const treeResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees`,
            {
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
            }
        );
        const treeData = await treeResponse.json();

        const filesCount = Object.keys(files).length;
        const newCommitResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/commits`,
            {
                method: "POST",
                headers: {
                    Authorization: authHeader,
                    Accept: "application/vnd.github+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `Update ${filesCount} file${filesCount > 1 ? "s" : ""} via Voxel Studio`,
                    tree: treeData.sha,
                    parents: [commitSha]
                })
            }
        );
        const newCommitData = await newCommitResponse.json();

        await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: authHeader,
                    Accept: "application/vnd.github+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sha: newCommitData.sha
                })
            }
        );

        return c.json({ filesModified: filesCount });
    } catch (error) {
        console.error("Failed to push changes:", error);
        return c.json({ error: "Failed to push changes" }, 500);
    }
});

app.post("/api/github/pr", async (c) => {
    const authHeader = c.req.header("authorization");
    if (!authHeader) {
        return c.json({ error: "Missing authorization token" }, 401);
    }

    const { owner, repo, baseBranch, files } = await c.req.json();

    try {
        const branchName = `voxel-studio-${Date.now()}`;

        const refResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`,
            {
                headers: {
                    Authorization: authHeader,
                    Accept: "application/vnd.github+json"
                }
            }
        );
        const refData = await refResponse.json();
        const baseSha = refData.object.sha;

        await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/refs`,
            {
                method: "POST",
                headers: {
                    Authorization: authHeader,
                    Accept: "application/vnd.github+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ref: `refs/heads/${branchName}`,
                    sha: baseSha
                })
            }
        );

        const commitResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/commits/${baseSha}`,
            {
                headers: {
                    Authorization: authHeader,
                    Accept: "application/vnd.github+json"
                }
            }
        );
        const commitData = await commitResponse.json();
        const baseTreeSha = commitData.tree.sha;

        const blobPromises = Object.entries(files as Record<string, string>).map(async ([path, content]) => {
            const blobResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/git/blobs`,
                {
                    method: "POST",
                    headers: {
                        Authorization: authHeader,
                        Accept: "application/vnd.github+json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        content,
                        encoding: "base64"
                    })
                }
            );
            const blobData = await blobResponse.json();
            return {
                path,
                mode: "100644",
                type: "blob",
                sha: blobData.sha
            };
        });

        const tree = await Promise.all(blobPromises);

        const treeResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees`,
            {
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
            }
        );
        const treeData = await treeResponse.json();

        const filesCount = Object.keys(files).length;
        const newCommitResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/commits`,
            {
                method: "POST",
                headers: {
                    Authorization: authHeader,
                    Accept: "application/vnd.github+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `Update ${filesCount} file${filesCount > 1 ? "s" : ""} via Voxel Studio`,
                    tree: treeData.sha,
                    parents: [baseSha]
                })
            }
        );
        const newCommitData = await newCommitResponse.json();

        await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branchName}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: authHeader,
                    Accept: "application/vnd.github+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sha: newCommitData.sha
                })
            }
        );

        const prResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/pulls`,
            {
                method: "POST",
                headers: {
                    Authorization: authHeader,
                    Accept: "application/vnd.github+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: "Update from Voxel Studio",
                    head: branchName,
                    base: baseBranch,
                    body: `Updated ${filesCount} file${filesCount > 1 ? "s" : ""} via Voxel Studio`
                })
            }
        );

        const prData = await prResponse.json();
        return c.json({ prUrl: prData.html_url });
    } catch (error) {
        console.error("Failed to create pull request:", error);
        return c.json({ error: "Failed to create pull request" }, 500);
    }
});

function transformRepo(repo: GitHubRepo) {
    return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || "",
        private: repo.private,
        owner: repo.owner.login,
        avatar_url: repo.owner.avatar_url,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        updated_at: repo.updated_at,
        default_branch: repo.default_branch
    };
}

export default app;

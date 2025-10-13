import { Hono } from "hono";
import { cors } from "hono/cors";
import "@voxelio/env/config";
import { GitHub } from "@/lib/github/GitHub";

type SendRequest = {
    owner: string;
    repo: string;
    branch: string;
    files: Record<string, string | null>;
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

    const github = new GitHub("", GITHUB_CLIENT, GITHUB_SECRET);
    const tokenData = await github.getAccessToken(code);
    if (tokenData.error) {
        return c.json({ error: tokenData.error_description || "Failed to get access token" }, 400);
    }

    const githubWithToken = new GitHub(tokenData.access_token as string, GITHUB_CLIENT, GITHUB_SECRET);
    const { login, id, avatar_url } = await githubWithToken.getUser();
    return c.json({
        token: tokenData.access_token,
        user: { login, id, avatar_url }
    });
});

app.get("/api/github/repos", async (c) => {
    const authHeader = c.req.header("authorization");
    if (!authHeader) {
        return c.json({ error: "Missing authorization token" }, 401);
    }

    const github = new GitHub(authHeader, "", "");
    const [repositories, organizations] = await Promise.all([github.getUserRepos(), github.getUserOrgs()]);
    const orgReposPromises = organizations.map((org) => github.getOrgRepos(org.login));
    const orgRepos = await Promise.all(orgReposPromises);
    const allOrgRepos = orgRepos.flat();

    return c.json({
        repositories,
        organizations: organizations.map(({ login, id, avatar_url, description }) => ({ login, id, avatar_url, description })),
        orgRepositories: allOrgRepos
    });
});

app.get("/api/github/download/:owner/:repo/:branch", async (c) => {
    const authHeader = c.req.header("authorization");
    const { owner, repo, branch } = c.req.param();
    if (!authHeader) {
        return c.json({ error: "Missing authorization token" }, 401);
    }

    const github = new GitHub(authHeader, "", "");
    const response = await github.downloadRepo(owner, repo, branch);
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
    const { owner, repo, branch, files } = await c.req.json<SendRequest>();
    if (!authHeader) {
        return c.json({ error: "Missing authorization token" }, 401);
    }

    try {
        const github = new GitHub(authHeader, "", "");
        const refData = await github.getRef(owner, repo, branch);
        const baseSha = refData.object.sha;
        const { treeData, body, filesCount } = await github.prepareCommit(owner, repo, baseSha, files);
        const newCommitData = await github.createCommit(owner, repo, body, treeData.sha, baseSha);
        await github.updateRef(owner, repo, branch, newCommitData.sha);

        return c.json({ filesModified: filesCount });
    } catch (error) {
        console.error("Failed to push changes:", error);
        return c.json({ error: "Failed to push changes" }, 500);
    }
});

app.post("/api/github/pr", async (c) => {
    const authHeader = c.req.header("authorization");
    const { owner, repo, branch, files } = await c.req.json<SendRequest>();
    if (!authHeader) {
        return c.json({ error: "Missing authorization token" }, 401);
    }

    try {
        const github = new GitHub(authHeader, "", "");
        const branchName = `voxel-studio-${Date.now()}`;
        const refData = await github.getRef(owner, repo, branch);
        const baseSha = refData.object.sha;
        await github.createRef(owner, repo, branchName, baseSha);

        const { treeData, body } = await github.prepareCommit(owner, repo, baseSha, files);
        const newCommitData = await github.createCommit(owner, repo, body, treeData.sha, baseSha);
        await github.updateRef(owner, repo, branchName, newCommitData.sha);

        const prData = await github.createPullRequest(owner, repo, "Update from Voxel Studio", branchName, branch, body);
        return c.json({ prUrl: prData.html_url });
    } catch (error) {
        console.error("Failed to create pull request:", error);
        return c.json({ error: "Failed to create pull request" }, 500);
    }
});

export default app;

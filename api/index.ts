import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { GitHub } from "./_lib/github/GitHub.js";
import { GitHubError } from "./_lib/github/GitHubError.js";
import { handle } from "hono/vercel";

type SendRequest = {
    owner: string;
    repo: string;
    branch: string;
    files: Record<string, string | null>;
};

const app = new Hono();

app.onError((err, c) =>
    c.json(
        { error: err instanceof GitHubError ? err.message : "Internal Server Error" },
        err instanceof GitHubError ? (err.statusCode as ContentfulStatusCode) : 500
    )
);
app.use("/api/*", cors());
app.get("/api/hello", (c) => c.json({ message: "Hello, world!" }));
app.get("/api/github/auth", (c) => {
    const GITHUB_CLIENT = process.env.GITHUB_CLIENT;
    if (!GITHUB_CLIENT) {
        return c.json({ error: "Missing GitHub configuration" }, 400);
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
    const clientId = process.env.GITHUB_CLIENT;
    const clientSecret = process.env.GITHUB_SECRET;
    const github = new GitHub({ clientId, clientSecret });
    const { access_token: token } = await github.getAccessToken(code);
    const githubWithToken = new GitHub({ authHeader: token as string });
    const { login, id, avatar_url } = await githubWithToken.getUser();

    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const authData = btoa(JSON.stringify({ token, user: { login, id, avatar_url }, expiry: expiry.toISOString() }));

    c.header("Set-Cookie", `voxel_github_auth=${authData}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);
    return c.json({ success: true, user: { login, id, avatar_url } });
});

app.get("/api/github/session", async (c) => {
    const cookie = c.req.header("cookie");
    const authCookie = cookie?.split(";").find((c) => c.trim().startsWith("voxel_github_auth="));

    if (!authCookie) return c.json({ authenticated: false }, 401);

    const authData = JSON.parse(atob(authCookie.split("=")[1]));
    const expiryDate = new Date(authData.expiry);

    if (expiryDate < new Date()) {
        return c.json({ authenticated: false }, 401);
    }

    return c.json({ authenticated: true, user: authData.user, token: authData.token });
});

app.post("/api/github/logout", async (c) => {
    c.header("Set-Cookie", "voxel_github_auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
    return c.json({ success: true });
});

app.get("/api/github/repos", async (c) => {
    const cookie = c.req.header("cookie");
    const authCookie = cookie?.split(";").find((c) => c.trim().startsWith("voxel_github_auth="));
    if (!authCookie) return c.json({ error: "Unauthorized" }, 401);
    const authData = JSON.parse(atob(authCookie.split("=")[1]));

    const github = new GitHub({ authHeader: authData.token });
    const [repositories, rawOrganizations] = await Promise.all([github.getUserRepos(), github.getUserOrgs()]);
    const organizations = rawOrganizations.map(({ login, id, avatar_url, description }) => ({ login, id, avatar_url, description }));
    const orgReposPromises = rawOrganizations.map((org) => github.getOrgRepos(org.login));
    const orgRepos = await Promise.all(orgReposPromises);
    const orgRepositories = orgRepos.flat();

    return c.json({ repositories, organizations, orgRepositories });
});

app.get("/api/github/download/:owner/:repo/:branch", async (c) => {
    const authHeader = c.req.header("authorization");
    const { owner, repo, branch } = c.req.param();
    const github = new GitHub({ authHeader });
    const response = await github.downloadRepo(owner, repo, branch);
    const arrayBuffer = await response.arrayBuffer();

    return c.body(new Uint8Array(arrayBuffer), 200, {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${repo}.zip"`
    });
});

app.post("/api/github/push", async (c) => {
    const authHeader = c.req.header("authorization");
    const { owner, repo, branch, files } = await c.req.json<SendRequest>();
    const github = new GitHub({ authHeader });
    const refData = await github.getRef(owner, repo, branch);
    const baseSha = refData.object.sha;
    const { treeData, body, filesCount } = await github.prepareCommit(owner, repo, baseSha, files);
    const newCommitData = await github.createCommit(owner, repo, body, treeData.sha, baseSha);

    await github.updateRef(owner, repo, branch, newCommitData.sha);
    return c.json({ filesModified: filesCount });
});

app.post("/api/github/pr", async (c) => {
    const authHeader = c.req.header("authorization");
    const { owner, repo, branch, files } = await c.req.json<SendRequest>();
    const github = new GitHub({ authHeader });
    const branchName = `voxel-studio-${Date.now()}`;
    const refData = await github.getRef(owner, repo, branch);
    const baseSha = refData.object.sha;
    await github.createRef(owner, repo, branchName, baseSha);

    const { treeData, body } = await github.prepareCommit(owner, repo, baseSha, files);
    const newCommitData = await github.createCommit(owner, repo, body, treeData.sha, baseSha);
    await github.updateRef(owner, repo, branchName, newCommitData.sha);

    const prData = await github.createPullRequest(owner, repo, "Update from Voxel Studio", branchName, branch, body);
    return c.json({ prUrl: prData.html_url });
});

export default handle(app);
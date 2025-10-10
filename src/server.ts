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
        updated_at: repo.updated_at
    };
}

export default app;

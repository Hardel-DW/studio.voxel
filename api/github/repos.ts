import type { VercelRequest, VercelResponse } from "@/lib/api";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: "Missing authorization token" });
    }

    try {
        const [userRepos, orgs] = await Promise.all([
            fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/vnd.github+json"
                }
            }),
            fetch("https://api.github.com/user/orgs", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/vnd.github+json"
                }
            })
        ]);

        if (!userRepos.ok || !orgs.ok) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const [repositories, organizations] = await Promise.all([
            userRepos.json(),
            orgs.json()
        ]);

        const orgReposPromises = organizations.map((org: { login: string }) =>
            fetch(`https://api.github.com/orgs/${org.login}/repos?per_page=100&sort=updated`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/vnd.github+json"
                }
            }).then((r) => r.json())
        );

        const orgRepos = await Promise.all(orgReposPromises);
        const allOrgRepos = orgRepos.flat();

        return res.status(200).json({
            repositories: repositories.map((repo: unknown) => transformRepo(repo)),
            organizations: organizations.map((org: { login: string; id: number; avatar_url: string; description: string }) => ({
                login: org.login,
                id: org.id,
                avatar_url: org.avatar_url,
                description: org.description
            })),
            orgRepositories: allOrgRepos.map((repo: unknown) => transformRepo(repo))
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch repositories" });
    }
}

function transformRepo(repo: unknown) {
    const r = repo as { id: number; name: string; full_name: string; description: string | null; private: boolean; owner: { login: string; avatar_url: string }; html_url: string; clone_url: string; updated_at: string };
    return {
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description || "",
        private: r.private,
        owner: r.owner.login,
        avatar_url: r.owner.avatar_url,
        html_url: r.html_url,
        clone_url: r.clone_url,
        updated_at: r.updated_at
    };
}

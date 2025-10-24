import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/session";
import { GitHub, type ReposResponse } from "../github/GitHub";

export const getAllReposFn = createServerFn({ method: "GET" }).handler(async (): Promise<ReposResponse> => {
    const session = await useAppSession();
    const data = session.data;

    if (!data.githubToken) {
        throw new Error("Unauthorized - no GitHub token in session");
    }

    const github = new GitHub({ authHeader: data.githubToken });
    const [repositories, rawOrganizations] = await Promise.all([
        github.getUserRepos(),
        github.getUserOrgs(),
    ]);

    const organizations = rawOrganizations.map(({ login, id, avatar_url, description }) => ({
        login,
        id,
        avatar_url,
        description,
    }));

    const orgReposPromises = rawOrganizations.map((org) => github.getOrgRepos(org.login));
    const orgRepos = await Promise.all(orgReposPromises);
    const orgRepositories = orgRepos.flat();

    return { repositories, organizations, orgRepositories };
});

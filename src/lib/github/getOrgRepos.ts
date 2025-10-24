import { createGitHubHeaders } from "./headers";

export async function getOrgRepos(token: string, org: string) {
    const response = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100&sort=updated`, {
        headers: createGitHubHeaders(`Bearer ${token}`)
    });

    return response.json();
}

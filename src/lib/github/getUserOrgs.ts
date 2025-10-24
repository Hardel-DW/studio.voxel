import { createGitHubHeaders } from "./headers";

type GitHubOrganization = {
    login: string;
    id: number;
    avatar_url: string;
    description: string;
};

export async function getUserOrgs(token: string): Promise<GitHubOrganization[]> {
    const response = await fetch("https://api.github.com/user/orgs", {
        headers: createGitHubHeaders(`Bearer ${token}`)
    });

    return response.json();
}

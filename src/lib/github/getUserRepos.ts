import { createGitHubHeaders } from "./headers";

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

export async function getUserRepos(token: string): Promise<GitHubRepo[]> {
    const response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
        headers: createGitHubHeaders(`Bearer ${token}`)
    });

    return response.json();
}

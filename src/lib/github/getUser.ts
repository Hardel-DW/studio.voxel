import { createGitHubHeaders } from "./headers";

export async function getUser(token: string): Promise<{ login: string; id: number; avatar_url: string }> {
    const response = await fetch("https://api.github.com/user", {
        headers: createGitHubHeaders(`Bearer ${token}`)
    });

    return response.json();
}

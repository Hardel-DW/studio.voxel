type GitHubOrganization = {
    login: string;
    id: number;
    avatar_url: string;
    description: string;
};

export async function getUserOrgs(token: string): Promise<GitHubOrganization[]> {
    const response = await fetch("https://api.github.com/user/orgs", {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json"
        }
    });

    return response.json();
}

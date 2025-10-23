export async function getOrgRepos(token: string, org: string) {
    const response = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100&sort=updated`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json"
        }
    });

    return response.json();
}

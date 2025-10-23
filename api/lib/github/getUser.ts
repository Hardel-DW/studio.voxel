export async function getUser(token: string): Promise<{ login: string; id: number; avatar_url: string }> {
    const response = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json"
        }
    });

    return response.json();
}

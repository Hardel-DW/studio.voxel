export async function initiateGitHubAuth(): Promise<{ url: string }> {
    const response = await fetch("/api/github/auth");
    if (!response.ok) throw new Error("Failed to initiate authentication");
    return response.json();
}

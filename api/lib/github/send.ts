export async function send(token: string, owner: string, repositoryName: string, branch: string, action: "pr" | "push") {
    const response = await fetch(action === "pr" ? "/api/github/pr" : "/api/github/push", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ owner, repositoryName, branch })
    });

    return response.json();
}

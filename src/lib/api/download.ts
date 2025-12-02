const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

export const downloadRepo = (owner: string, repo: string, branch: string) =>
    fetch(
        `${API_BASE_URL}/download?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&branch=${encodeURIComponent(branch)}`,
        {
            method: "GET",
            credentials: "include"
        }
    ).then((r) => {
        if (!r.ok) throw new Error("Failed to download repository");
        return r;
    });

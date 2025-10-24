export function createGitHubHeaders(authHeader?: string, includeContentType = false): Record<string, string> {
    const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "User-Agent": "Voxel-Studio"
    };

    if (authHeader) {
        headers.Authorization = authHeader;
    }

    if (includeContentType) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}

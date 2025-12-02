const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

export async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: { "Content-Type": "application/json", ...options?.headers }
    });

    if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || response.statusText);
    }

    return response.status === 204 ? (undefined as T) : response.json();
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
}

interface AuthState {
    token: string;
    user: GitHubUser;
    expiry: string;
}

interface Repository {
    id: number;
    name: string;
    full_name: string;
    description: string;
    private: boolean;
    owner: string;
    avatar_url: string;
    html_url: string;
    clone_url: string;
    updated_at: string;
}

interface Organization {
    login: string;
    id: number;
    avatar_url: string;
    description: string;
}

interface ReposResponse {
    repositories: Repository[];
    organizations: Organization[];
    orgRepositories: Repository[];
}

const STORAGE_KEY = "voxel_github_auth";
const TOKEN_EXPIRY_DAYS = 7;
const AUTH_QUERY_KEY = ["github", "auth"] as const;
const REPOS_QUERY_KEY = ["github", "repos"] as const;

function getStoredAuth(): AuthState | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const parsed = JSON.parse(atob(stored));
        const expiryDate = new Date(parsed.expiry);

        if (expiryDate < new Date()) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
}

function storeAuth(token: string, user: GitHubUser): AuthState {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + TOKEN_EXPIRY_DAYS);

    const data: AuthState = {
        token,
        user,
        expiry: expiry.toISOString()
    };

    localStorage.setItem(STORAGE_KEY, btoa(JSON.stringify(data)));
    return data;
}

function clearAuth(): void {
    localStorage.removeItem(STORAGE_KEY);
}

async function initiateGitHubAuth(): Promise<{ url: string }> {
    const response = await fetch("/api/github/auth");
    if (!response.ok) throw new Error("Failed to initiate authentication");
    return response.json();
}

async function fetchRepositories(token: string): Promise<ReposResponse> {
    const response = await fetch("/api/github/repos", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            clearAuth();
            throw new Error("Token expired");
        }
        throw new Error("Failed to fetch repositories");
    }

    return response.json();
}

export function useGitHubAuth() {
    const queryClient = useQueryClient();

    const authQuery = useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: getStoredAuth,
        staleTime: Number.POSITIVE_INFINITY
    });

    const loginMutation = useMutation({
        mutationFn: async () => {
            const { url } = await initiateGitHubAuth();

            return new Promise<AuthState>((resolve, reject) => {
                const width = 600;
                const height = 700;
                const left = window.screen.width / 2 - width / 2;
                const top = window.screen.height / 2 - height / 2;

                const popup = window.open(url, "GitHub OAuth", `width=${width},height=${height},left=${left},top=${top}`);

                const messageHandler = (event: MessageEvent) => {
                    if (event.origin !== window.location.origin) return;

                    if (event.data.type === "github-auth-success") {
                        const authState = storeAuth(event.data.token, event.data.user);
                        window.removeEventListener("message", messageHandler);
                        resolve(authState);
                    }
                };

                window.addEventListener("message", messageHandler);

                const checkPopup = setInterval(() => {
                    if (popup?.closed) {
                        clearInterval(checkPopup);
                        window.removeEventListener("message", messageHandler);
                        reject(new Error("Authentication cancelled"));
                    }
                }, 500);
            });
        },
        onSuccess: (data) => {
            queryClient.setQueryData(AUTH_QUERY_KEY, data);
        }
    });

    const logout = () => {
        clearAuth();
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
        queryClient.removeQueries({ queryKey: REPOS_QUERY_KEY });
    };

    return {
        isAuthenticated: !!authQuery.data,
        user: authQuery.data?.user ?? null,
        token: authQuery.data?.token ?? null,
        login: loginMutation.mutate,
        loginAsync: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        logout
    };
}

export function useGitHubRepos() {
    const { token, isAuthenticated } = useGitHubAuth();

    return useQuery({
        queryKey: REPOS_QUERY_KEY,
        queryFn: () => {
            if (!token) throw new Error("Not authenticated");
            return fetchRepositories(token);
        },
        enabled: isAuthenticated && !!token,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30
    });
}

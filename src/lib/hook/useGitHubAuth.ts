import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GitHub } from "@/lib/github/GitHub";

const AUTH_QUERY_KEY = ["github", "auth"] as const;
const REPOS_QUERY_KEY = ["github", "repos"] as const;

export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
}

export interface AuthState {
    token: string;
    user: GitHubUser;
}

export function useGitHubAuth() {
    const queryClient = useQueryClient();

    const authQuery = useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: () => new GitHub().getSession(),
        staleTime: 0,
        retry: false
    });

    const loginMutation = useMutation({
        mutationFn: async () => {
            const returnTo = window.location.pathname;
            await new GitHub().initiateAuth(returnTo);
        }
    });

    const logoutMutation = useMutation({
        mutationFn: async () => await new GitHub().logout(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: REPOS_QUERY_KEY });
        }
    });

    return {
        isAuthenticated: !!authQuery.data,
        user: authQuery.data?.user ?? null,
        token: authQuery.data?.token ?? null,
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        logout: logoutMutation.mutate
    };
}

export function useGitHubRepos(token: string | null) {
    return useQuery({
        queryKey: [REPOS_QUERY_KEY, token],
        queryFn: () => new GitHub({ token }).getAllRepos(),
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30
    });
}

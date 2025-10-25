import { extractZip } from "@voxelio/zip";
import { initiateGitHubAuthFn } from "@/lib/server/auth";
import { downloadRepoFn } from "@/lib/server/download";
import { createPullRequestFn, pushToGitHubFn } from "@/lib/server/push";
import { getAllReposFn } from "@/lib/server/repos";
import { getSessionFn, logoutFn } from "@/lib/server/session";
import { GitHubError } from "./GitHubError";

type TreeItem = {
    path: string;
    mode?: string;
    type?: string;
    sha: string | null;
};

export type Repository = {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    owner: {
        login: string;
        avatar_url: string;
    };
    html_url: string;
    clone_url: string;
    updated_at: string;
    default_branch: string;
};

export type Organization = {
    login: string;
    id: number;
    avatar_url: string;
    description: string;
};

export type ReposResponse = {
    repositories: Repository[];
    organizations: Organization[];
    orgRepositories: Repository[];
};

type GitHubOptions = {
    token?: string | null;
};

export class GitHub {
    private token: string | null;

    constructor({ token = null }: GitHubOptions = {}) {
        this.token = token;
    }

    private get authenticatedToken(): string {
        if (!this.token) {
            throw new GitHubError("Missing authorization token", 401);
        }
        return this.token;
    }

    private buildHeaders(options?: { requireAuth?: boolean; contentType?: boolean }): Record<string, string> {
        const { requireAuth = true, contentType = false } = options || {};

        const headers: Record<string, string> = {
            Accept: "application/vnd.github+json",
            "User-Agent": "Voxel-Studio"
        };

        if (requireAuth) {
            headers.Authorization = `Bearer ${this.authenticatedToken}`;
        }

        if (contentType) {
            headers["Content-Type"] = "application/json";
        }

        return headers;
    }

    private async request<T>(method: "GET" | "POST" | "PATCH" | "DELETE", path: string, body?: unknown): Promise<T> {
        const headers = this.buildHeaders({ contentType: body !== undefined });

        const response = await fetch(`https://api.github.com${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            throw new GitHubError(`GitHub API error: ${response.statusText}`, response.status);
        }

        return response.json();
    }

    getUser() {
        return this.request<{ login: string; id: number; avatar_url: string }>("GET", "/user");
    }

    getUserRepos() {
        return this.request<Repository[]>("GET", "/user/repos?per_page=100&sort=updated");
    }

    getUserOrgs() {
        return this.request<Organization[]>("GET", "/user/orgs");
    }

    getOrgRepos(org: string) {
        return this.request<Repository[]>("GET", `/orgs/${org}/repos?per_page=100&sort=updated`);
    }

    getRef(owner: string, repo: string, branch: string) {
        return this.request<{ ref: string; object: { sha: string } }>("GET", `/repos/${owner}/${repo}/git/ref/heads/${branch}`);
    }

    getCommit(owner: string, repo: string, sha: string) {
        return this.request<{ sha: string; tree: { sha: string } }>("GET", `/repos/${owner}/${repo}/git/commits/${sha}`);
    }

    createBlob(owner: string, repo: string, content: string) {
        const encoding = "base64";
        return this.request<{ sha: string }>("POST", `/repos/${owner}/${repo}/git/blobs`, { content, encoding });
    }

    createTree(owner: string, repo: string, baseTreeSha: string, tree: TreeItem[]) {
        const base_tree = baseTreeSha;
        return this.request<{ sha: string }>("POST", `/repos/${owner}/${repo}/git/trees`, { base_tree, tree });
    }

    createCommit(owner: string, repo: string, message: string, treeSha: string, parentSha: string) {
        const parents = [parentSha];
        const tree = treeSha;
        return this.request<{ sha: string }>("POST", `/repos/${owner}/${repo}/git/commits`, { message, tree, parents });
    }

    updateRef(owner: string, repo: string, branch: string, sha: string) {
        return this.request<{ ref: string; object: { sha: string } }>("PATCH", `/repos/${owner}/${repo}/git/refs/heads/${branch}`, { sha });
    }

    createRef(owner: string, repo: string, branch: string, sha: string) {
        const ref = `refs/heads/${branch}`;
        return this.request<{ ref: string; object: { sha: string } }>("POST", `/repos/${owner}/${repo}/git/refs`, { ref, sha });
    }

    createPullRequest(owner: string, repo: string, title: string, head: string, base: string, body: string) {
        return this.request<{ html_url: string; number: number }>("POST", `/repos/${owner}/${repo}/pulls`, { title, head, base, body });
    }

    async downloadRepo(owner: string, repo: string, branch: string) {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`, {
            headers: this.buildHeaders()
        });

        if (!response.ok) {
            throw new GitHubError("Failed to download repository", response.status);
        }

        return response;
    }

    async getAccessToken(clientId: string, clientSecret: string, code: string) {
        const response = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: this.buildHeaders({ requireAuth: false, contentType: true }),
            body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
        });

        if (!response.ok) {
            throw new GitHubError(`GitHub returned ${response.status}`, response.status);
        }

        const data = (await response.json()) as { access_token?: string; error?: string; error_description?: string };

        if (data.error) {
            throw new GitHubError(data.error_description || "Failed to get access token", 400);
        }

        return data;
    }

    async getAllRepos(): Promise<ReposResponse> {
        return getAllReposFn();
    }

    async getSession() {
        const data = await getSessionFn();
        return data.authenticated ? { token: data.token, user: data.user } : null;
    }

    async logout() {
        return logoutFn();
    }

    async prepareCommit(owner: string, repo: string, baseSha: string, files: Record<string, string | null>) {
        const commitData = await this.getCommit(owner, repo, baseSha);
        const tree = await Promise.all(
            Object.entries(files).map(async ([path, content]) => {
                if (content === null) return { path, sha: null };

                const blobData = await this.createBlob(owner, repo, content);
                return { path, mode: "100644", type: "blob", sha: blobData.sha };
            })
        );

        const treeData = await this.createTree(owner, repo, commitData.tree.sha, tree);
        const filesCount = Object.keys(files).length;
        const body = `Update ${filesCount} file${filesCount > 1 ? "s" : ""} via Voxel Studio\n\nCo-authored-by: Voxel Studio <studio.voxelio@gmail.com>`;
        return { treeData, body, filesCount };
    }

    async send(owner: string, repositoryName: string, branch: string, action?: "pr" | "push", files?: Record<string, string | null>) {
        if (!action) throw new GitHubError("Missing action parameter", 400);
        if (!files) throw new GitHubError("Missing files parameter", 400);

        const params = { data: { owner, repo: repositoryName, branch, files } };
        if (import.meta.env.VITE_DISABLE_GITHUB_ACTIONS) return { filesModified: Object.keys(files).length, prUrl: undefined };
        return action === "push" ? pushToGitHubFn(params) : createPullRequestFn(params);
    }

    async clone(owner: string, repositoryName: string, branch: string, removeRootFolder: boolean) {
        const response = await downloadRepoFn({ data: { owner, repo: repositoryName, branch } });
        const zipData = new Uint8Array(await response.arrayBuffer());
        const extractedFiles = await extractZip(zipData);

        if (!removeRootFolder) {
            return extractedFiles;
        }

        const firstPath = Object.keys(extractedFiles)[0];
        const rootPrefix = firstPath.includes("/") ? `${firstPath.split("/")[0]}/` : "";
        return Object.fromEntries(
            Object.entries(extractedFiles)
                .filter(([path]) => path.startsWith(rootPrefix))
                .map(([path, data]) => [path.substring(rootPrefix.length), data])
        );
    }

    async initiateAuth(returnTo?: string) {
        const result = await initiateGitHubAuthFn({ data: { returnTo } });
        window.location.href = result.authUrl;
    }
}

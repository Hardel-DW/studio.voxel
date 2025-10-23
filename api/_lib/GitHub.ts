import { createBlob } from "./github/createBlob";
import { createCommit } from "./github/createCommit";
import { createPullRequest } from "./github/createPullRequest";
import { createRef } from "./github/createRef";
import { createTree } from "./github/createTree";
import { downloadRepo } from "./github/downloadRepo";
import { GitHubError } from "./GitHubError";
import { getAccessToken } from "./github/getAccessToken";
import { getCommit } from "./github/getCommit";
import { getOrgRepos } from "./github/getOrgRepos";
import { getRef } from "./github/getRef";
import { getUser } from "./github/getUser";
import { getUserOrgs } from "./github/getUserOrgs";
import { getUserRepos } from "./github/getUserRepos";
import { initiateGitHubAuth } from "./github/initiateAuth";
import { send } from "./github/send";
import { updateRef } from "./github/updateRef";

type TreeItem = {
    path: string;
    mode?: string;
    type?: string;
    sha: string | null;
};

type GitHubOptions = {
    authHeader?: string | null;
    clientId?: string | null;
    clientSecret?: string | null;
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

export class GitHub {
    private authHeader: string | null;
    private clientId: string | null;
    private clientSecret: string | null;

    constructor({ authHeader = null, clientId = null, clientSecret = null }: GitHubOptions = {}) {
        this.authHeader = authHeader;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    private get authenticatedHeader() {
        if (!this.authHeader) {
            throw new GitHubError("Missing authorization token", 401);
        }
        return this.authHeader;
    }

    private get authenticatedToken() {
        if (!this.authHeader) {
            throw new GitHubError("Missing authorization token", 401);
        }
        return this.authHeader.replace("Bearer ", "");
    }

    async getAccessToken(code?: string) {
        if (!code) {
            throw new GitHubError("Missing code parameter", 400);
        }

        if (!this.clientId || !this.clientSecret) {
            throw new GitHubError("Missing GitHub configuration", 500);
        }

        const data = await getAccessToken(this.clientId, this.clientSecret, code);
        if (data.error) {
            throw new GitHubError(data.error_description || "Failed to get access token", 400);
        }
        return data;
    }

    async downloadRepo(owner: string, repo: string, branch: string) {
        const response = await downloadRepo(this.authenticatedHeader, owner, repo, branch);
        if (!response.ok) {
            throw new GitHubError("Failed to download repository", response.status);
        }
        return response;
    }

    getUser() {
        return getUser(this.authenticatedToken);
    }

    getUserRepos() {
        return getUserRepos(this.authenticatedToken);
    }

    getUserOrgs() {
        return getUserOrgs(this.authenticatedToken);
    }

    getOrgRepos(org: string) {
        return getOrgRepos(this.authenticatedToken, org);
    }

    async getAllRepos(): Promise<ReposResponse> {
        const response = await fetch("/api/github/repos", {
            credentials: "include"
        });

        if (!response.ok) {
            throw new GitHubError("Failed to fetch repositories", response.status);
        }

        return response.json();
    }

    async getSession() {
        const response = await fetch("/api/github/session", {
            credentials: "include"
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data.authenticated ? { token: data.token, user: data.user } : null;
    }

    async logout() {
        const response = await fetch("/api/github/logout", {
            method: "POST",
            credentials: "include"
        });

        if (!response.ok) {
            throw new GitHubError("Failed to logout", response.status);
        }

        return response.json();
    }

    getRef(owner: string, repo: string, branch: string) {
        return getRef(this.authenticatedHeader, owner, repo, branch);
    }

    getCommit(owner: string, repo: string, commitSha: string) {
        return getCommit(this.authenticatedHeader, owner, repo, commitSha);
    }

    createBlob(owner: string, repo: string, content: string) {
        return createBlob(this.authenticatedHeader, owner, repo, content);
    }

    createTree(owner: string, repo: string, baseTreeSha: string, tree: TreeItem[]) {
        return createTree(this.authenticatedHeader, owner, repo, baseTreeSha, tree);
    }

    createCommit(owner: string, repo: string, message: string, treeSha: string, parentSha: string) {
        return createCommit(this.authenticatedHeader, owner, repo, message, treeSha, parentSha);
    }

    updateRef(owner: string, repo: string, branch: string, sha: string) {
        return updateRef(this.authenticatedHeader, owner, repo, branch, sha);
    }

    createRef(owner: string, repo: string, branch: string, sha: string) {
        return createRef(this.authenticatedHeader, owner, repo, branch, sha);
    }

    createPullRequest(owner: string, repo: string, title: string, head: string, base: string, body: string) {
        return createPullRequest(this.authenticatedHeader, owner, repo, title, head, base, body);
    }

    async prepareCommit(owner: string, repo: string, baseSha: string, files: Record<string, string | null>) {
        const commitData = await this.getCommit(owner, repo, baseSha);
        const baseTreeSha = commitData.tree.sha;

        const tree = await Promise.all(
            Object.entries(files).map(async ([path, content]) => {
                if (content === null) {
                    return { path, sha: null };
                }

                const blobData = await this.createBlob(owner, repo, content);
                return {
                    path,
                    mode: "100644",
                    type: "blob",
                    sha: blobData.sha as string
                };
            })
        );

        const treeData = await this.createTree(owner, repo, baseTreeSha, tree);
        const filesCount = Object.keys(files).length;
        const body = `Update ${filesCount} file${filesCount > 1 ? "s" : ""} via Voxel Studio\n\nCo-authored-by: Voxel Studio <studio.voxelio@gmail.com>`;
        return { treeData, body, filesCount };
    }

    async send(owner: string, repositoryName: string, branch: string, action?: "pr" | "push") {
        if (!action) throw new GitHubError("Missing action parameter", 400);
        return send(this.authenticatedToken, owner, repositoryName, branch, action);
    }

    async initiateAuth() {
        const { url } = await initiateGitHubAuth();
        return url;
    }
}

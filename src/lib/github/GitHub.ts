import { createBlob } from "./createBlob";
import { createCommit } from "./createCommit";
import { createPullRequest } from "./createPullRequest";
import { createRef } from "./createRef";
import { createTree } from "./createTree";
import { downloadRepo } from "./downloadRepo";
import { getAccessToken } from "./getAccessToken";
import { getCommit } from "./getCommit";
import { getOrgRepos } from "./getOrgRepos";
import { getRef } from "./getRef";
import { getUser } from "./getUser";
import { getUserOrgs } from "./getUserOrgs";
import { getUserRepos } from "./getUserRepos";
import { updateRef } from "./updateRef";
import { GitHubError } from "./GitHubError";

type TreeItem = {
    path: string;
    mode?: string;
    type?: string;
    sha: string | null;
};

type GitHubOptions = {
    authHeader?: string;
    clientId?: string;
    clientSecret?: string;
};

export class GitHub {
    private authHeader: string;
    private clientId: string;
    private clientSecret: string;

    constructor({ authHeader = "", clientId = "", clientSecret = "" }: GitHubOptions = {}) {
        this.authHeader = authHeader;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    get token() {
        return this.authHeader.replace("Bearer ", "");
    }

    private ensureAuth() {
        if (!this.authHeader) {
            throw new GitHubError("Missing authorization token", 401);
        }
    }

    private ensureCredentials() {
        if (!this.clientId || !this.clientSecret) {
            throw new GitHubError("Missing GitHub configuration", 500);
        }
    }

    async getAccessToken(code?: string) {
        if (!code) {
            throw new GitHubError("Missing code parameter", 400);
        }
        this.ensureCredentials();

        const data = await getAccessToken(this.clientId, this.clientSecret, code);
        if (data.error) {
            throw new GitHubError(data.error_description || "Failed to get access token", 400);
        }
        return data;
    }

    getUser() {
        this.ensureAuth();
        return getUser(this.token);
    }

    getUserRepos() {
        this.ensureAuth();
        return getUserRepos(this.token);
    }

    getUserOrgs() {
        this.ensureAuth();
        return getUserOrgs(this.token);
    }

    getOrgRepos(org: string) {
        this.ensureAuth();
        return getOrgRepos(this.token, org);
    }

    async downloadRepo(owner: string, repo: string, branch: string) {
        this.ensureAuth();
        const response = await downloadRepo(this.authHeader, owner, repo, branch);
        if (!response.ok) {
            throw new GitHubError("Failed to download repository", response.status);
        }
        return response;
    }

    getRef(owner: string, repo: string, branch: string) {
        this.ensureAuth();
        return getRef(this.authHeader, owner, repo, branch);
    }

    getCommit(owner: string, repo: string, commitSha: string) {
        this.ensureAuth();
        return getCommit(this.authHeader, owner, repo, commitSha);
    }

    createBlob(owner: string, repo: string, content: string) {
        this.ensureAuth();
        return createBlob(this.authHeader, owner, repo, content);
    }

    createTree(owner: string, repo: string, baseTreeSha: string, tree: TreeItem[]) {
        this.ensureAuth();
        return createTree(this.authHeader, owner, repo, baseTreeSha, tree);
    }

    createCommit(owner: string, repo: string, message: string, treeSha: string, parentSha: string) {
        this.ensureAuth();
        return createCommit(this.authHeader, owner, repo, message, treeSha, parentSha);
    }

    updateRef(owner: string, repo: string, branch: string, sha: string) {
        this.ensureAuth();
        return updateRef(this.authHeader, owner, repo, branch, sha);
    }

    createRef(owner: string, repo: string, branch: string, sha: string) {
        this.ensureAuth();
        return createRef(this.authHeader, owner, repo, branch, sha);
    }

    createPullRequest(owner: string, repo: string, title: string, head: string, base: string, body: string) {
        this.ensureAuth();
        return createPullRequest(this.authHeader, owner, repo, title, head, base, body);
    }

    async prepareCommit(owner: string, repo: string, baseSha: string, files: Record<string, string | null>) {
        this.ensureAuth();
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
        const body = `Update ${filesCount} file${filesCount > 1 ? "s" : ""} via Voxel Studio`;

        return { treeData, body, filesCount };
    }
}

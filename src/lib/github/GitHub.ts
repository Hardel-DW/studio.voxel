import { createBlob } from "./createBlob";
import { createCommit } from "./createCommit";
import { createPullRequest } from "./createPullRequest";
import { createRef } from "./createRef";
import { createTree } from "./createTree";
import { downloadRepo } from "./downloadRepo";
import { GitHubError } from "./GitHubError";
import { getAccessToken } from "./getAccessToken";
import { getCommit } from "./getCommit";
import { getOrgRepos } from "./getOrgRepos";
import { getRef } from "./getRef";
import { getUser } from "./getUser";
import { getUserOrgs } from "./getUserOrgs";
import { getUserRepos } from "./getUserRepos";
import { updateRef } from "./updateRef";

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
}

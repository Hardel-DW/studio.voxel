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

type TreeItem = {
    path: string;
    mode?: string;
    type?: string;
    sha: string | null;
};

export class GitHub {
    private authHeader: string;
    private clientId: string;
    private clientSecret: string;

    constructor(authHeader: string, clientId: string, clientSecret: string) {
        this.authHeader = authHeader;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    get token() {
        return this.authHeader.replace("Bearer ", "");
    }

    getAccessToken(code: string) {
        return getAccessToken(this.clientId, this.clientSecret, code);
    }

    getUser() {
        return getUser(this.token);
    }

    getUserRepos() {
        return getUserRepos(this.token);
    }

    getUserOrgs() {
        return getUserOrgs(this.token);
    }

    getOrgRepos(org: string) {
        return getOrgRepos(this.token, org);
    }

    downloadRepo(owner: string, repo: string, branch: string) {
        return downloadRepo(this.authHeader, owner, repo, branch);
    }

    getRef(owner: string, repo: string, branch: string) {
        return getRef(this.authHeader, owner, repo, branch);
    }

    getCommit(owner: string, repo: string, commitSha: string) {
        return getCommit(this.authHeader, owner, repo, commitSha);
    }

    createBlob(owner: string, repo: string, content: string) {
        return createBlob(this.authHeader, owner, repo, content);
    }

    createTree(owner: string, repo: string, baseTreeSha: string, tree: TreeItem[]) {
        return createTree(this.authHeader, owner, repo, baseTreeSha, tree);
    }

    createCommit(owner: string, repo: string, message: string, treeSha: string, parentSha: string) {
        return createCommit(this.authHeader, owner, repo, message, treeSha, parentSha);
    }

    updateRef(owner: string, repo: string, branch: string, sha: string) {
        return updateRef(this.authHeader, owner, repo, branch, sha);
    }

    createRef(owner: string, repo: string, branch: string, sha: string) {
        return createRef(this.authHeader, owner, repo, branch, sha);
    }

    createPullRequest(owner: string, repo: string, title: string, head: string, base: string, body: string) {
        return createPullRequest(this.authHeader, owner, repo, title, head, base, body);
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
        const body = `Update ${filesCount} file${filesCount > 1 ? "s" : ""} via Voxel Studio`;

        return { treeData, body, filesCount };
    }
}

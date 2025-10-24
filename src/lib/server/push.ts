import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/session";
import { GitHub } from "../github/GitHub";

type PushInput = {
    owner: string;
    repo: string;
    branch: string;
    files: Record<string, string | null>;
};

export const pushToGitHubFn = createServerFn({ method: "POST" })
    .inputValidator((data: PushInput) => {
        if (!data.owner || typeof data.owner !== "string") {
            throw new Error("Missing or invalid owner");
        }
        if (!data.repo || typeof data.repo !== "string") {
            throw new Error("Missing or invalid repo");
        }
        if (!data.branch || typeof data.branch !== "string") {
            throw new Error("Missing or invalid branch");
        }
        if (!data.files || typeof data.files !== "object") {
            throw new Error("Missing or invalid files");
        }
        return data;
    })
    .handler(async ({ data }) => {
        const session = await useAppSession();
        const sessionData = session.data;

        if (!sessionData.githubToken) {
            throw new Error("Unauthorized - no GitHub token in session");
        }

        const github = new GitHub({ authHeader: sessionData.githubToken });
        const refData = await github.getRef(data.owner, data.repo, data.branch);
        const baseSha = refData.object.sha;

        const { treeData, body, filesCount } = await github.prepareCommit(data.owner, data.repo, baseSha, data.files);

        const newCommitData = await github.createCommit(data.owner, data.repo, body, treeData.sha, baseSha);

        await github.updateRef(data.owner, data.repo, data.branch, newCommitData.sha);

        return { filesModified: filesCount, prUrl: undefined };
    });

export const createPullRequestFn = createServerFn({ method: "POST" })
    .inputValidator((data: PushInput) => {
        if (!data.owner || typeof data.owner !== "string") {
            throw new Error("Missing or invalid owner");
        }
        if (!data.repo || typeof data.repo !== "string") {
            throw new Error("Missing or invalid repo");
        }
        if (!data.branch || typeof data.branch !== "string") {
            throw new Error("Missing or invalid branch");
        }
        if (!data.files || typeof data.files !== "object") {
            throw new Error("Missing or invalid files");
        }
        return data;
    })
    .handler(async ({ data }) => {
        const session = await useAppSession();
        const sessionData = session.data;

        if (!sessionData.githubToken) {
            throw new Error("Unauthorized - no GitHub token in session");
        }

        const github = new GitHub({ authHeader: sessionData.githubToken });
        const branchName = `voxel-studio-${Date.now()}`;
        const refData = await github.getRef(data.owner, data.repo, data.branch);
        const baseSha = refData.object.sha;

        await github.createRef(data.owner, data.repo, branchName, baseSha);

        const { treeData, body, filesCount } = await github.prepareCommit(data.owner, data.repo, baseSha, data.files);

        const newCommitData = await github.createCommit(data.owner, data.repo, body, treeData.sha, baseSha);
        await github.updateRef(data.owner, data.repo, branchName, newCommitData.sha);

        const prData = await github.createPullRequest(data.owner, data.repo, "Update from Voxel Studio", branchName, data.branch, body);

        return { filesModified: filesCount, prUrl: prData.html_url };
    });

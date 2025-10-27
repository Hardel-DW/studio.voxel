import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/hook/useAppSession";
import { z } from "@/lib/utils/validator";
import { GitHub } from "../github/GitHub";

type PushInput = {
    owner: string;
    repo: string;
    branch: string;
    files: Record<string, string | null>;
};

export const pushToGitHubFn = createServerFn({ method: "POST" })
    .inputValidator((data: PushInput) =>
        z
            .object({
                owner: z.string().min(1).description("Repository owner"),
                repo: z.string().min(1).description("Repository name"),
                branch: z.string().min(1).description("Branch name"),
                files: z.record(z.string().nullable())
            })
            .parse(data)
    )
    .handler(async ({ data }) => {
        const session = await useAppSession();
        const sessionData = session.data;

        if (!sessionData.githubToken) {
            throw new Error("Unauthorized - no GitHub token in session");
        }

        const github = new GitHub({ token: sessionData.githubToken });
        const refData = await github.getRef(data.owner, data.repo, data.branch);
        const baseSha = refData.object.sha;

        const { treeData, body, filesCount } = await github.prepareCommit(data.owner, data.repo, baseSha, data.files);

        const newCommitData = await github.createCommit(data.owner, data.repo, body, treeData.sha, baseSha);

        await github.updateRef(data.owner, data.repo, data.branch, newCommitData.sha);

        return { filesModified: filesCount, prUrl: undefined };
    });

export const createPullRequestFn = createServerFn({ method: "POST" })
    .inputValidator((data: PushInput) =>
        z
            .object({
                owner: z.string().min(1).description("Repository owner"),
                repo: z.string().min(1).description("Repository name"),
                branch: z.string().min(1).description("Branch name"),
                files: z.record(z.string().nullable())
            })
            .parse(data)
    )
    .handler(async ({ data }) => {
        const session = await useAppSession();
        const sessionData = session.data;

        if (!sessionData.githubToken) {
            throw new Error("Unauthorized - no GitHub token in session");
        }

        const github = new GitHub({ token: sessionData.githubToken });
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

import { createServerFn } from "@tanstack/react-start";
import { GitHub } from "@/lib/github/GitHub";
import { useAppSession } from "@/lib/hook/useAppSession";
import { z } from "@/lib/utils/validator";

type InitRepositoryInput = {
    name: string;
    description: string;
    isPrivate: boolean;
    autoInit: boolean;
    files?: Record<string, string | null>;
};

export const initializeRepositoryFn = createServerFn({ method: "POST" })
    .inputValidator((data: InitRepositoryInput) =>
        z
            .object({
                name: z.string().min(1).description("Repository name"),
                description: z.string().description("Repository description"),
                isPrivate: z.boolean().description("Private repository flag"),
                autoInit: z.boolean().description("Auto-initialize repository flag"),
                files: z.record(z.string().nullable()).optional()
            })
            .parse(data)
    )
    .handler(async ({ data }) => {
        const session = await useAppSession();
        const sessionData = session.data;

        if (!sessionData.githubToken) {
            throw new Error("Unauthorized - no GitHub token in session");
        }

        GitHub.validateRepository(data.files);
        const hasFiles = data.files && Object.keys(data.files).length > 0;
        const github = new GitHub({ token: sessionData.githubToken });
        const repository = await github.createRepository(data.name, data.description, data.isPrivate, true);

        if (hasFiles) {
            const [owner] = repository.full_name.split("/");
            const refData = await github.getRef(owner, repository.name, repository.default_branch);
            const baseSha = refData.object.sha;

            const { treeData, body } = await github.prepareCommit(owner, repository.name, baseSha, data.files);
            const newCommitData = await github.createCommit(owner, repository.name, body, treeData.sha, baseSha);
            await github.updateRef(owner, repository.name, repository.default_branch, newCommitData.sha);
        }

        return {
            name: repository.name,
            fullName: repository.full_name,
            htmlUrl: repository.html_url,
            defaultBranch: repository.default_branch
        };
    });

import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/hook/useAppSession";
import { z } from "@/lib/utils/validator";
import { GitHub } from "../github/GitHub";

type InitRepositoryInput = {
    name: string;
    description: string;
    isPrivate: boolean;
    autoInit: boolean;
};

export const initializeRepositoryFn = createServerFn({ method: "POST" })
    .inputValidator((data: InitRepositoryInput) => z.object({
        name: z.string().min(1).description("Repository name"),
        description: z.string().description("Repository description"),
        isPrivate: z.boolean().description("Private repository flag"),
        autoInit: z.boolean().description("Auto-initialize repository flag")
    }).parse(data))
    .handler(async ({ data }) => {
        const session = await useAppSession();
        const sessionData = session.data;

        if (!sessionData.githubToken) {
            throw new Error("Unauthorized - no GitHub token in session");
        }

        const github = new GitHub({ token: sessionData.githubToken });
        const repository = await github.createRepository(data.name, data.description, data.isPrivate, data.autoInit);

        return {
            name: repository.name,
            fullName: repository.full_name,
            htmlUrl: repository.html_url,
            defaultBranch: repository.default_branch
        };
    });

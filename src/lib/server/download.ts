import { createServerFn } from "@tanstack/react-start";
import { GitHub } from "@/lib/github/GitHub";
import { useAppSession } from "@/lib/hook/useAppSession";
import { z } from "@/lib/utils/validator";

type DownloadInput = {
    owner: string;
    repo: string;
    branch: string;
};

export const downloadRepoFn = createServerFn({ method: "GET" })
    .inputValidator((data: DownloadInput) =>
        z
            .object({
                owner: z.string().min(1).description("Repository owner"),
                repo: z.string().min(1).description("Repository name"),
                branch: z.string().min(1).description("Branch name")
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
        const response = await github.downloadRepo(data.owner, data.repo, data.branch);
        const arrayBuffer = await response.arrayBuffer();

        return new Response(new Uint8Array(arrayBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${data.repo}.zip"`
            }
        });
    });

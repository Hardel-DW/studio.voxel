import { createServerFn } from "@tanstack/react-start";
import { GitHub } from "@/lib/github/GitHub";
import { useAppSession } from "@/lib/session";

type DownloadInput = {
    owner: string;
    repo: string;
    branch: string;
};

export const downloadRepoFn = createServerFn({ method: "GET" })
    .inputValidator((data: DownloadInput) => {
        if (!data.owner || typeof data.owner !== "string") {
            throw new Error("Missing or invalid owner");
        }
        if (!data.repo || typeof data.repo !== "string") {
            throw new Error("Missing or invalid repo");
        }
        if (!data.branch || typeof data.branch !== "string") {
            throw new Error("Missing or invalid branch");
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

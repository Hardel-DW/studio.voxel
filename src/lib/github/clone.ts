import { extractZip } from "@voxelio/zip";
import { downloadRepoFn } from "@/lib/server/download";

export async function clone(owner: string, repositoryName: string, branch: string, removeRootFolder: boolean) {
    const response = await downloadRepoFn({ data: { owner, repo: repositoryName, branch } });
    const zipData = new Uint8Array(await response.arrayBuffer());
    const extractedFiles = await extractZip(zipData);

    if (!removeRootFolder) {
        return extractedFiles;
    }

    const firstPath = Object.keys(extractedFiles)[0];
    const rootPrefix = firstPath?.includes("/") ? `${firstPath.split("/")[0]}/` : "";

    return Object.fromEntries(
        Object.entries(extractedFiles)
            .filter(([path]) => path.startsWith(rootPrefix))
            .map(([path, data]) => [path.substring(rootPrefix.length), data])
    );
}

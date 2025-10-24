import { extractZip } from "@voxelio/zip";

export async function clone(token: string, owner: string, repositoryName: string, branch: string, removeRootFolder: boolean) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repositoryName}/zipball/${branch}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        mode: "no-cors",
    });

    const zipData = new Uint8Array(await response.arrayBuffer());
    const extractedFiles = await extractZip(zipData);
    const firstPath = Object.keys(extractedFiles)[0];
    const rootPrefix = firstPath?.includes("/") ? `${firstPath.split("/")[0]}/` : "";
    return removeRootFolder
        ? Object.fromEntries(
            Object.entries(extractedFiles)
                .filter(([path]) => path.startsWith(rootPrefix))
                .map(([path, data]) => [path.substring(rootPrefix.length), data])
        )
        : extractedFiles;
}

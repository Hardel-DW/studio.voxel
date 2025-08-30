export async function fetchDatapackPreset(version: number): Promise<Blob> {
    const fileName = `enchantment-${version}.zip`;
    const githubUrl = `https://raw.githubusercontent.com/Hardel-DW/voxel-datapack-preset/main/${fileName}`;

    const response = await fetch(githubUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch datapack: ${response.status}`);
    }

    return response.blob();
}

export async function fetchMinecraftRegistry(registry: string): Promise<any> {
    const registryPath = registry.startsWith("tags/") ? registry.replace(/^tags\//, "tag/") : registry;
    const baseUrl = "https://raw.githubusercontent.com/misode/mcmeta/registries";
    const fileUrl = `${baseUrl}/${registryPath}/data.min.json`;

    const response = await fetch(fileUrl);
    if (!response.ok) {
        throw new Error(`Registry not found: ${response.status}`);
    }

    return response.json();
}

export async function fetchMinecraftSummary(registry: string): Promise<any> {
    const registryPath = registry.startsWith("tags/") ? registry.replace(/^tags\//, "tag/") : registry;
    const baseUrl = "https://raw.githubusercontent.com/misode/mcmeta/summary/data";
    const fileUrl = `${baseUrl}/${registryPath}/data.min.json`;

    const response = await fetch(fileUrl);
    if (!response.ok) {
        throw new Error(`Registry not found: ${response.status}`);
    }

    return response.json();
}

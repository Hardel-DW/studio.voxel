import { gunzipSync } from "fflate";

export const BASE_URL = "https://raw.githubusercontent.com/misode/mcmeta";
export const MCMETA_PATH = {
    component: "/summary/item_components",
    registry: "/registries",
    summary: "/summary/data"
};

export async function fetchDatapackPreset(version: number): Promise<Blob> {
    const fileName = `enchantment-${version}.zip`;
    const githubUrl = `https://raw.githubusercontent.com/Hardel-DW/voxel-datapack-preset/main/${fileName}`;

    const response = await fetch(githubUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch datapack: ${response.status}`);
    }

    return response.blob();
}

// Fonction helper pour fetcher les données gzippées
export async function fetchGzippedData(type: keyof typeof MCMETA_PATH, registry?: string): Promise<any> {
    const basePath = MCMETA_PATH[type];
    const registryPath = registry?.startsWith("tags/") ? registry.replace(/^tags\//, "tag/") : registry;
    const suffix = registry ? `/${registryPath}/data.json.gz` : "/data.json.gz";
    const fileUrl = `${BASE_URL}${basePath}${suffix}`;

    const response = await fetch(fileUrl, {
        headers: { "Accept-Encoding": "gzip" }
    });

    if (!response.ok) {
        throw new Error(`Registry not found: ${response.status}`);
    }

    const compressedData = await response.arrayBuffer();
    const decompressed = gunzipSync(new Uint8Array(compressedData));

    return JSON.parse(new TextDecoder().decode(decompressed));
}

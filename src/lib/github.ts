import { gunzipSync } from "fflate";

export const BASE_URL = "https://raw.githubusercontent.com/misode/mcmeta";
export const MCMETA_PATH = {
    component: {
        path: "/summary/item_components",
        gzip: true
    },
    registry: {
        path: "/registries",
        gzip: false
    },
    summary: {
        path: "/summary/data",
        gzip: true
    }
} as const;

export async function fetchDatapackPreset(version: number): Promise<Blob> {
    const fileName = `enchantment-${version}.zip`;
    const githubUrl = `https://raw.githubusercontent.com/Hardel-DW/voxel-datapack-preset/main/${fileName}`;

    const response = await fetch(githubUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch datapack: ${response.status}`);
    }

    return response.blob();
}

export async function fetchMcmetaData(type: keyof typeof MCMETA_PATH, registry?: string): Promise<any> {
    const { path, gzip } = MCMETA_PATH[type];
    const registryPath = registry?.startsWith("tags/") ? registry.replace(/^tags\//, "tag/") : registry;
    const base = registry ? `${BASE_URL}${path}/${registryPath}` : `${BASE_URL}${path}`;
    const suffix = gzip ? "/data.json.gz" : "/data.min.json";
    const url = `${base}${suffix}`;

    const response = await fetch(url, gzip ? { headers: { "Accept-Encoding": "gzip" } } : undefined);
    if (!response.ok) {
        throw new Error(`Registry not found: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const data = new Uint8Array(buffer);
    const text = gzip ? new TextDecoder().decode(gunzipSync(data)) : new TextDecoder().decode(data);
    return JSON.parse(text);
}

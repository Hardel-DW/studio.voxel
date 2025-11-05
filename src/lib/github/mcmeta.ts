import { gunzipSync } from "fflate";

export const BASE_URL = "https://raw.githubusercontent.com/misode/mcmeta";
export const MCMETA_PATH = {
    component: {
        branch: "summary",
        path: "/summary/item_components",
        dataPath: "/item_components",
        gzip: true
    },
    registry: {
        branch: "registries",
        path: "/registries",
        dataPath: "",
        gzip: false
    },
    summary: {
        branch: "summary",
        path: "/summary/data",
        dataPath: "/data",
        gzip: true
    }
} as const;

export async function fetchMcmetaData(type: keyof typeof MCMETA_PATH, version: string, registry?: string): Promise<any> {
    const config = MCMETA_PATH[type];
    const { gzip, dataPath } = config;
    const registryPath = registry?.startsWith("tags/") ? registry.replace(/^tags\//, "tag/") : registry;
    const registryPathSegment = registryPath ? `/${registryPath}` : "";
    const suffix = gzip ? "/data.json.gz" : "/data.min.json";
    const url = `${BASE_URL}/${version}${dataPath}${registryPathSegment}${suffix}`;

    const response = await fetch(url, gzip ? { headers: { "Accept-Encoding": "gzip" } } : undefined);
    if (!response.ok) {
        throw new Error(`Registry not found: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const data = new Uint8Array(buffer);
    const text = gzip ? new TextDecoder().decode(gunzipSync(data)) : new TextDecoder().decode(data);
    return JSON.parse(text);
}

import { Identifier } from "@voxelio/breeze";
import type { CONCEPT_KEY } from "@/lib/data/elements";

export function getConceptFromPathname(pathname: string): CONCEPT_KEY | null {
    const pathParts = pathname.split("/").filter(Boolean);
    if (pathParts.length >= 4 && pathParts[1] === "studio" && pathParts[2] === "editor") {
        return pathParts[3] as CONCEPT_KEY;
    }
    return null;
}

export function parseFilePath(path: string): Identifier | null {
    const parts = path.split("/");
    if (parts.length < 4 || !path.endsWith(".json")) return null;

    const [, namespace, ...rest] = parts;
    const resourceWithExt = rest.pop();
    if (!resourceWithExt || !namespace) return null;

    const resource = resourceWithExt.replace(/\.json$/, "");
    const registry = rest.join("/");
    if (!registry || !resource) return null;

    return new Identifier({ namespace, registry, resource });
}

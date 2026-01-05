import type { CONCEPT_KEY } from "@/lib/data/elements";

export function getConceptFromPathname(pathname: string): CONCEPT_KEY | null {
    const pathParts = pathname.split("/").filter(Boolean);
    if (pathParts.length >= 4 && pathParts[1] === "studio" && pathParts[2] === "editor") {
        return pathParts[3] as CONCEPT_KEY;
    }
    return null;
}

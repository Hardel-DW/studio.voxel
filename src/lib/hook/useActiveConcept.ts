import { useLocation, useParams } from "@tanstack/react-router";
import { useConfiguratorStore } from "@/components/tools/Store";
import { CONCEPTS } from "@/lib/data/elements";
import { getConceptFromPathname } from "@/lib/utils/concept";

export function useActiveConcept() {
    const pathname = useLocation({ select: (loc) => loc.pathname });
    const params = useParams({ from: "/$lang/studio/editor" });
    const selectedElement = useConfiguratorStore((state) => state.currentElementId);
    const currentConcept = getConceptFromPathname(pathname);
    const concept = CONCEPTS.find((c) => c.registry === currentConcept);
    const activeTab = concept?.tabs.find((tab) => pathname === tab.url.replace("$lang", params.lang));

    return {
        concept,
        tabs: concept?.tabs ?? [],
        activeTab,
        lang: params.lang,
        hasSelectedElement: !!selectedElement,
        isOnValidTab: !!activeTab,
        showTabs: !!selectedElement && !!activeTab && (concept?.tabs.length ?? 0) > 1
    };
}

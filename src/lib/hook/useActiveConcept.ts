import { useLocation, useParams } from "@tanstack/react-router";
import { useConfiguratorStore } from "@/components/tools/Store";
import { CONCEPTS } from "@/lib/data/elements";

export function useActiveConcept() {
    const location = useLocation();
    const params = useParams({ from: "/$lang/studio/editor" });
    const getConcept = useConfiguratorStore((state) => state.getConcept);
    const selectedElement = useConfiguratorStore((state) => state.currentElementId);
    const currentConcept = getConcept(location.pathname);
    const concept = CONCEPTS.find((c) => c.registry === currentConcept);
    const activeTab = concept?.tabs.find((tab) => location.pathname === tab.url.replace("$lang", params.lang));

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

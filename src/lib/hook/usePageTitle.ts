import { useLocation } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useTranslate } from "@/lib/hook/useTranslation";

/**
 * Hook to get the dynamic page title based on current route and selected element
 */
export function usePageTitle(): string {
    const { pathname } = useLocation();
    const currentElementId = useConfiguratorStore((state) => state.currentElementId);
    const getConcept = useConfiguratorStore((state) => state.getConcept);
    const concept = getConcept(pathname);
    const pathParts = pathname.split("/").filter(Boolean);
    const pageName = pathParts[pathParts.length - 1];
    const homeTitle = useTranslate("metadata:home");
    const conceptTitle = useTranslate(concept ? `concepts.${concept}` : "");
    const pageTitle = useTranslate(concept ? `metadata:${concept}.${pageName}` : "");

    if (!concept) return homeTitle;

    if (currentElementId) {
        const elementName = Identifier.fromUniqueKey(currentElementId).toResourceName();
        return `${conceptTitle} - ${elementName}`;
    }

    return pageTitle;
}

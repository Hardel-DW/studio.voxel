import { useLocation } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useTranslateKey } from "@/lib/hook/useTranslation";

/**
 * Hook to get the dynamic page title based on current route and selected element
 */
export function usePageTitle(): string {
    const { pathname } = useLocation();
    const { currentElementId, elements, getConcept } = useConfiguratorStore();
    const concept = getConcept(pathname);
    const pathParts = pathname.split("/").filter(Boolean);
    const pageName = pathParts[pathParts.length - 1];
    const homeTitle = useTranslateKey("metadata:home");
    const conceptTitle = useTranslateKey(concept ? `concepts.${concept}` : "");
    const pageTitle = useTranslateKey(concept ? `metadata:${concept}.${pageName}` : "");

    if (!concept) return homeTitle;

    if (currentElementId && elements.has(currentElementId)) {
        const element = elements.get(currentElementId);
        if (element) {
            const elementName = new Identifier(element.identifier).toResourceName();
            return `${conceptTitle} - ${elementName}`;
        }
    }

    return pageTitle;
}

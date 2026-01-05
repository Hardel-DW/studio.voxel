import { useMatches, useNavigate, useParams } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { createContext } from "react";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import type { TreeNodeType } from "@/lib/utils/tree";

interface TreeConfig {
    overviewRoute: string;
    detailRoute: string;
    changesRoute: string;
    concept: string;
    tabRoutes?: string[];
    tree: TreeNodeType;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
    disableAutoExpand?: boolean;
    onSelectElement?: (elementId: string) => void;
}

interface TreeContextValue {
    // State
    filterPath: string;
    currentElementId: string | null;
    isAllActive: boolean;
    // Config
    tree: TreeNodeType;
    concept: string;
    changesRoute: string;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
    disableAutoExpand?: boolean;
    // Actions
    selectFolder: (path: string) => void;
    selectElement: (elementId: string) => void;
    selectAll: () => void;
    clearSelection: () => void;
}

export const TreeContext = createContext<TreeContextValue | null>(null);
export function TreeProvider({ config, children }: { config: TreeConfig; children: React.ReactNode }) {
    const matches = useMatches();
    const navigate = useNavigate();
    const filterPath = useEditorUiStore((s) => s.filterPath);
    const setFilterPath = useEditorUiStore((s) => s.setFilterPath);
    const currentElementId = useConfiguratorStore((s) => s.currentElementId);
    const openTab = useConfiguratorStore((s) => s.openTab);
    const clearSelection = () => useConfiguratorStore.getState().setCurrentElementId(null);
    const isOnTab = config.tabRoutes?.some((route) => matches.map((m) => m.routeId as string).includes(route));
    const { lang } = useParams({ from: "/$lang" });

    const selectFolder = (path: string) => {
        setFilterPath(path);
        clearSelection();
        navigate({ to: config.overviewRoute, params: { lang } });
    };

    const selectElement = (elementId: string) => {
        if (config.onSelectElement) {
            config.onSelectElement(elementId);
            return;
        }
        const label = Identifier.fromUniqueKey(elementId).resource;
        openTab(elementId, config.detailRoute, label);
        if (!isOnTab) {
            navigate({ to: config.detailRoute, params: { lang } });
        }
    };

    const selectAll = () => {
        setFilterPath("");
        clearSelection();
        navigate({ to: config.overviewRoute, params: { lang } });
    };

    const value: TreeContextValue = {
        filterPath,
        currentElementId: currentElementId ?? null,
        isAllActive: filterPath === "" && !currentElementId,
        tree: config.tree,
        concept: config.concept,
        changesRoute: config.changesRoute,
        elementIcon: config.elementIcon,
        folderIcons: config.folderIcons,
        disableAutoExpand: config.disableAutoExpand,
        selectFolder,
        selectElement,
        selectAll,
        clearSelection
    };

    return <TreeContext value={value}>{children}</TreeContext>;
}

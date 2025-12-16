import { useNavigate, useParams } from "@tanstack/react-router";
import { createContext, use } from "react";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { useConfiguratorStore } from "@/components/tools/Store";

interface TreeNavigationConfig {
    overviewRoute: string;
    detailRoute: string;
}

interface TreeNavigationContextValue {
    filterPath: string;
    currentElementId: string | null;
    isAllActive: boolean;
    selectFolder: (path: string) => void;
    selectElement: (elementId: string) => void;
    selectAll: () => void;
    clearSelection: () => void;
}

const TreeNavigationContext = createContext<TreeNavigationContextValue | null>(null);

export function TreeNavigationProvider({ config, children }: { config: TreeNavigationConfig; children: React.ReactNode }) {
    const { lang } = useParams({ from: "/$lang" });
    const navigate = useNavigate();
    const filterPath = useEditorUiStore((s) => s.filterPath);
    const setFilterPath = useEditorUiStore((s) => s.setFilterPath);
    const currentElementId = useConfiguratorStore((s) => s.currentElementId);
    const goto = useConfiguratorStore((s) => s.goto);

    const clearSelection = () => useConfiguratorStore.getState().setCurrentElementId(null);

    const selectFolder = (path: string) => {
        setFilterPath(path);
        clearSelection();
        navigate({ to: config.overviewRoute, params: { lang } });
    };

    const selectElement = (elementId: string) => {
        goto(elementId);
        navigate({ to: config.detailRoute, params: { lang } });
    };

    const selectAll = () => {
        setFilterPath("");
        clearSelection();
        navigate({ to: config.overviewRoute, params: { lang } });
    };

    const value: TreeNavigationContextValue = {
        filterPath,
        currentElementId: currentElementId ?? null,
        isAllActive: filterPath === "" && !currentElementId,
        selectFolder,
        selectElement,
        selectAll,
        clearSelection
    };

    return <TreeNavigationContext value={value}>{children}</TreeNavigationContext>;
}

export function useTreeNavigation() {
    const context = use(TreeNavigationContext);
    if (!context) {
        throw new Error("useTreeNavigation must be used within TreeNavigationProvider");
    }
    return context;
}

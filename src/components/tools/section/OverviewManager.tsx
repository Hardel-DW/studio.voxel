"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/ui/Loader";
import { useMemo } from "react";
import { useConfiguratorStore } from "../Store";
import type { Analysers } from "@voxelio/breeze";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ErrorPlaceholder from "@/components/tools/elements/error/Card";

const OVERVIEW_MAP: Partial<Record<Extract<keyof Analysers, string>, () => Promise<{ default: React.ComponentType }>>> = {
    enchantment: () => import("./enchantment/overview/Overview"),
    loot_table: () => import("./loot/overview/Overview"),
    recipe: () => import("./recipe/overview/Overview")
};

export default function OverviewManager() {
    const selectedConcept = useConfiguratorStore((state) => state.selectedConcept);
    const Component = useMemo(() => {
        const OverviewComponent = OVERVIEW_MAP[selectedConcept as keyof typeof OVERVIEW_MAP];
        if (!OverviewComponent) return null;

        return dynamic(OverviewComponent, {
            loading: () => <Loader />,
            ssr: false
        });
    }, [selectedConcept]);

    if (!Component) return null;
    return (
        <ErrorBoundary fallback={(e) => <ErrorPlaceholder error={e} />}>
            <Component />
        </ErrorBoundary>
    );
}

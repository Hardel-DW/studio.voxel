"use client";

import Loader from "@/components/ui/Loader";
import { Suspense, lazy } from "react";
import { useConfiguratorStore } from "../Store";

const OVERVIEW_MAP = {
    enchantment: () => import("./enchantment/overview/Overview")
};

export default function OverviewManager() {
    const selectedConcept = useConfiguratorStore((state) => state.selectedConcept);
    const OverviewComponent = OVERVIEW_MAP[selectedConcept as keyof typeof OVERVIEW_MAP];
    if (!OverviewComponent) return null;
    const Component = lazy(() => OverviewComponent());

    return (
        <Suspense fallback={<Loader />}>
            <Component />
        </Suspense>
    );
}

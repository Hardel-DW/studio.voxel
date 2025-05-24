"use client";

import { useConfiguratorStore } from "../Store";
import { Suspense, lazy } from "react";
import Loader from "@/components/ui/Loader";

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

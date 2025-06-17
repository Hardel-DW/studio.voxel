"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/ui/Loader";
import { useMemo } from "react";
import { useConfiguratorStore } from "../Store";

const OVERVIEW_MAP = {
    enchantment: () => import("./enchantment/overview/Overview")
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
    return <Component />;
}

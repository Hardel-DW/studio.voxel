"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import React, { useMemo, type PropsWithChildren, Suspense } from "react";
import Loader from "../ui/Loader";
import { MenuTabs, MenuTabsList, MenuTabsTrigger } from "../ui/MenuTabs";
import ConfiguratorContent from "./ConfiguratorContent";
import LazyTabs from "./LazyTabs";
import Translate from "./Translate";
import { CONCEPTS } from "./elements";
import OverviewManager from "./section/OverviewManager";
import ErrorBoundary from "../ui/ErrorBoundary";

export default function ConfiguratorPanel(props: PropsWithChildren) {
    const currentConcept = useConfiguratorStore((state) => state.selectedConcept);
    const selectedElement = useConfiguratorStore((state) => state.currentElementId);
    const activeConcept = useMemo(() => CONCEPTS.find((concept) => concept.registry === currentConcept), [currentConcept]);
    if (!activeConcept) return null;
    const defaultTab = activeConcept.tabs[0]?.id || "";

    if (!selectedElement) return <OverviewManager />;

    return (
        <MenuTabs defaultValue={defaultTab} className="contents">
            <MenuTabsList className="flex gap-x-5 bg-inherit justify-center pt-1 overflow-x-auto border-0 mb-4 pb-4 gap-y-4 border-b-2 rounded-none border-zinc-800 flex-wrap shrink-0">
                {activeConcept.tabs.map((tab) => (
                    <MenuTabsTrigger
                        key={tab.id}
                        value={tab.id}
                        disabled={tab.soon}
                        className="backdrop-blur-2xl ring-1 ring-zinc-900 data-[state=active]:ring-zinc-600 data-[state=active]:bg-transparent">
                        <Translate content={tab.text} schema={true} />
                    </MenuTabsTrigger>
                ))}
            </MenuTabsList>

            <div className="contents">
                <ErrorBoundary fallback={<div>Error</div>}>
                    {activeConcept.tabs.map((tab) => {
                        const TabComponent = LazyTabs(tab.section);
                        return (
                            <ConfiguratorContent key={tab.id} tab={tab}>
                                <Suspense fallback={<Loader />}>
                                    <TabComponent />
                                </Suspense>
                            </ConfiguratorContent>
                        );
                    })}
                    {props.children}
                </ErrorBoundary>
            </div>
        </MenuTabs>
    );
}

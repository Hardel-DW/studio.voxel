import { useConfiguratorStore } from "@/components/tools/Store";
import { useMemo } from "react";
import { MenuTabs, MenuTabsList, MenuTabsTrigger } from "@/components/ui/MenuTabs";
import ConfiguratorContent from "@/components/tools/ConfiguratorContent";
import LazyTabs from "@/components/tools/LazyTabs";
import Translate from "@/components/tools/Translate";
import { CONCEPTS } from "@/components/tools/elements";
import OverviewManager from "@/components/tools/section/OverviewManager";

export default function ConfiguratorPanel() {
    const currentConcept = useConfiguratorStore((state) => state.selectedConcept);
    const selectedElement = useConfiguratorStore((state) => state.currentElementId);
    const activeConcept = useMemo(() => CONCEPTS.find((concept) => concept.registry === currentConcept), [currentConcept]);

    const lazyComponents = useMemo(() => {
        if (!activeConcept) return {};
        return Object.fromEntries(activeConcept.tabs.map((tab) => [tab.section, LazyTabs(tab.section)]));
    }, [activeConcept]);

    if (!activeConcept) return null;
    const defaultTab = activeConcept.tabs[0]?.id || "";

    return (
        <>
            <div className={selectedElement ? "hidden" : "contents"}>
                <OverviewManager />
            </div>

            {/* Tabs - Only show when element is selected */}
            {selectedElement && (
                <MenuTabs defaultValue={defaultTab} className="contents">
                    <MenuTabsList className="flex gap-x-5 bg-inherit justify-center pt-1 overflow-x-auto border-0 mb-4 pb-4 gap-y-4 border-b-2 rounded-none border-zinc-800 flex-wrap shrink-0">
                        {activeConcept.tabs.length > 1 && activeConcept.tabs.map((tab) => (
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
                        {activeConcept.tabs.map((tab) => {
                            const TabComponent = lazyComponents[tab.section];
                            return (
                                <ConfiguratorContent key={tab.id} tab={tab}>
                                    <TabComponent />
                                </ConfiguratorContent>
                            );
                        })}
                    </div>
                </MenuTabs>
            )}
        </>
    );
}

import { useLocation } from "@tanstack/react-router";
import { useRef } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import ExportButton from "@/components/tools/sidebar/export/ExportButton";
import ConceptTab from "@/components/tools/sidebar/tab/ConceptTab";
import DetailTab from "@/components/tools/sidebar/tab/DetailTab";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/Tabs";
import Translate from "@/components/ui/Translate";
import { useDebugStore } from "@/components/tools/debug/DebugStore";

export default function StudioSidebar() {
    const location = useLocation();
    const hasElements = useConfiguratorStore((state) => Object.keys(state.files).length > 0);
    const getConcept = useConfiguratorStore((state) => state.getConcept);
    const selectedConcept = getConcept(location.pathname);
    const buttonsContainerRef = useRef<HTMLDivElement>(null);
    if (!hasElements) return null;

    const handleDebugModalOpen = () => {
        const { openDebugModal } = useDebugStore.getState();
        const compiledDatapack = useConfiguratorStore.getState().compile();
        openDebugModal(compiledDatapack);
    };


    return (
        <div className="flex flex-col h-full pb-4">
            <div className="overflow-hidden flex-1">
                <div className="overflow-y-auto overflow-x-hidden h-full pb-16 mt-4">
                    <Tabs defaultValue="concepts" className="w-auto mb-4">
                        <TabsTrigger value="concepts" disabled={!selectedConcept}>
                            <Translate content="tabs.concepts" />
                        </TabsTrigger>
                        <TabsTrigger value="details" disabled={!selectedConcept}>
                            <Translate content="tabs.details" />
                        </TabsTrigger>

                        <TabsContent value="concepts">
                            <ConceptTab />
                        </TabsContent>
                        <TabsContent value="details">
                            <DetailTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <div ref={buttonsContainerRef} className="absolute bottom-0 left-0 right-0 max-md:px-4 pr-4 flex items-center gap-2">
                <ExportButton containerRef={buttonsContainerRef} />
                <Button type="button" variant="transparent" size="square" className="bg-zinc-900 border border-zinc-800 select-none" onClick={handleDebugModalOpen}>
                    <img src="/icons/settings.svg" alt="settings" className="size-8 invert" />
                </Button>
            </div>
        </div>
    );
}

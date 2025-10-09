import { useLocation } from "@tanstack/react-router";
import { useRef } from "react";
import DownloadButton from "@/components/tools/DownloadButton";
import { useConfiguratorStore } from "@/components/tools/Store";
import SettingsButton from "@/components/tools/sidebar/SettingsButton";
import ConceptTab from "@/components/tools/sidebar/tab/ConceptTab";
import DetailTab from "@/components/tools/sidebar/tab/DetailTab";
import Translate from "@/components/tools/Translate";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/Tabs";

export default function StudioSidebar() {
    const location = useLocation();
    const elements = useConfiguratorStore((state) => state.elements);
    const getConcept = useConfiguratorStore((state) => state.getConcept);
    const selectedConcept = getConcept(location.pathname);
    const buttonsContainerRef = useRef<HTMLDivElement>(null);
    if (elements.size === 0) return null;

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
                <DownloadButton containerRef={buttonsContainerRef} />
                <SettingsButton />
            </div>
        </div>
    );
}

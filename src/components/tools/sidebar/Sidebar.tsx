import { useRef } from "react";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import ExportButton from "@/components/tools/sidebar/export/ExportButton";
import { Button } from "@/components/ui/Button";
import Translate from "@/components/ui/Translate";
import { CONCEPTS } from "@/components/tools/elements";
import SidebarCard from "@/components/tools/sidebar/SidebarCard";

export default function StudioSidebar() {
    const hasElements = useConfiguratorStore((state) => Object.keys(state.files).length > 0);
    const getLengthByRegistry = useConfiguratorStore((state) => state.getLengthByRegistry);
    const buttonsContainerRef = useRef<HTMLDivElement>(null);
    if (!hasElements) return null;

    const handleDebugModalOpen = () => {
        const { openDebugModal } = useDebugStore.getState();
        const compiledDatapack = useConfiguratorStore.getState().compile();
        openDebugModal(compiledDatapack);
    };

    return (
        <div className="flex flex-col h-full pb-4 w-full">
            <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin flex flex-col items-center in-data-pinned:items-stretch w-full">
                <div className="flex flex-col gap-3 mt-4 px-2 w-full max-w-[320px] mx-auto">
                    {CONCEPTS.map((concept, index) => (
                        <SidebarCard
                            key={concept.title}
                            title={concept.title}
                            image={concept.image}
                            index={index}
                            registry={concept.registry}
                            overview={concept.overview}>
                            {getLengthByRegistry(concept.registry)} <Translate content="elements" />
                        </SidebarCard>
                    ))}
                </div>
            </div>

            <div
                ref={buttonsContainerRef}
                className="shrink-0 flex flex-col items-center gap-2 in-data-pinned:flex-row in-data-pinned:gap-2 px-2 mt-2 transition-all duration-300 w-full justify-center max-w-[320px] mx-auto">
                <ExportButton containerRef={buttonsContainerRef} />
                <Button
                    type="button"
                    variant="transparent"
                    size="square"
                    className="bg-zinc-900 border border-zinc-800 select-none aspect-square shrink-0"
                    onClick={handleDebugModalOpen}>
                    <img src="/icons/settings.svg" alt="settings" className="size-6 invert opacity-70" />
                </Button>
            </div>
        </div>
    );
}

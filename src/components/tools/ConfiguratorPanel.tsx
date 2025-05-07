"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import { MenuTabs, MenuTabsList, MenuTabsTrigger } from "@/components/ui/MenuTabs";
import ConfiguratorContent from "./ConfiguratorContent";
import Translate from "./Translate";
import LoadingSkeleton from "./elements/LoadingComponent";

export default function ConfiguratorPanel() {
    const hasElements = useConfiguratorStore((state) => state.elements.size > 0);
    const roadmap = useConfiguratorStore((state) => state.getRoadmap());

    if (!hasElements) return null;
    if (!roadmap) return <LoadingSkeleton />;

    return (
        <MenuTabs defaultValue={roadmap.sections[0].id} className="h-full flex flex-col">
            <div className="absolute w-full -z-10 inset-0 shadow-2xl bg-linear-to-r from-[#401727] to-[#311e7696] opacity-20 rounded-full blur-[10rem]" />
            <div className="contents">
                <MenuTabsList className="bg-inherit justify-center pt-1 overflow-x-auto border-0 mb-4 pb-4 gap-y-4 border-b-2 rounded-none border-zinc-800 flex-wrap shrink-0">
                    {roadmap.sections.map((tab) => (
                        <MenuTabsTrigger
                            className="data-[state=active]:bg-transparent backdrop-blur-2xl ring-1 ring-zinc-900 data-[state=active]:ring-zinc-600"
                            key={tab.id}
                            disabled={tab.soon}
                            value={tab.id}>
                            <Translate content={tab.text} schema={true} />
                            {tab.soon && <span className="text-xs text-zinc-400 font-light ml-1">(soon)</span>}
                        </MenuTabsTrigger>
                    ))}
                </MenuTabsList>

                {roadmap.sections.map((tab) => (
                    <ConfiguratorContent key={tab.id} tab={tab} />
                ))}
            </div>
        </MenuTabs>
    );
}

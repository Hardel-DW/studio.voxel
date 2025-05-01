"use client";

import DownloadButton from "@/components/tools/DownloadButton";
import ConceptTab from "@/components/tools/sidebar/tab/ConceptTab";
import DetailTab from "@/components/tools/sidebar/tab/DetailTab";
import Tabs from "@/components/ui/Tabs";
import { useRef, useState } from "react";
import { useConfiguratorStore } from "../Store";
import SettingsButton from "./SettingsButton";

const tabs = [
    { label: "Concepts", value: "concepts" },
    { label: "Details", value: "details" }
];

export default function StudioSidebar() {
    const [activeTab, setActiveTab] = useState<string>(tabs[0].value);

    const panelRef = useRef<HTMLDivElement>(null);
    const elements = useConfiguratorStore((state) => state.elements);
    if (elements.size === 0) return null;

    return (
        <div ref={panelRef} className="flex flex-col h-full pb-4">
            <div className="overflow-hidden flex-1">
                <div className="overflow-y-auto overflow-x-hidden h-full pb-16 mt-4">
                    <Tabs tabs={tabs} defaultTab={tabs[0].value} className="w-auto" onChange={setActiveTab} />

                    {activeTab === tabs[0].value && <ConceptTab />}
                    {activeTab === tabs[1].value && <DetailTab />}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 max-md:px-4 pr-4 flex items-center gap-2">
                <DownloadButton />
                <SettingsButton />
            </div>
        </div>
    );
}

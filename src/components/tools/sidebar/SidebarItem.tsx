"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import { cn } from "@/lib/utils";
import SidebarItemContent from "./SidebarItemContent";

export function SidebarItem({ elementId }: { elementId: string }) {
    const isSelected = useConfiguratorStore((state) => state.currentElementId === elementId);
    const setCurrentElementId = useConfiguratorStore((state) => state.setCurrentElementId);

    const handleClick = () => {
        setCurrentElementId(elementId);
    };

    return (
        <div
            onClick={handleClick}
            onKeyDown={handleClick}
            className={cn("odd:bg-black/50 even:bg-zinc-900/50 pl-4 pr-2 py-2 rounded-xl select-none text-zinc-200 tracking-tight", {
                "ring-1 ring-zinc-600": isSelected
            })}>
            <SidebarItemContent elementId={elementId} />
        </div>
    );
}

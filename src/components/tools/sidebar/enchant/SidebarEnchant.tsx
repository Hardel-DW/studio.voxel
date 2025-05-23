"use client";

import { useConfiguratorStore } from "../../Store";
import { SidebarItem } from "../SidebarItem";

export default function SidebarEnchant() {
    const elementIds = useConfiguratorStore((state) => state.sortedIdentifiers);

    return (
        <div className="flex flex-col pt-4 px-px gap-y-1">
            {elementIds.map((element) => (
                <SidebarItem key={element} elementId={element} />
            ))}
        </div>
    );
}

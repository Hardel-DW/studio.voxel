"use client";

import SidebarCrafting from "@/components/tools/sidebar/crafting/SidebarCrafting";
import SidebarEnchant from "@/components/tools/sidebar/enchant/SidebarEnchant";
import SidebarLoot from "@/components/tools/sidebar/loot/SidebarLoot";
import { useConfiguratorStore } from "@/components/tools/Store";
import { withConcept } from "@/components/tools/sidebar/tab/HocConcept";

export default function DetailTab() {
    const selectedConcept = useConfiguratorStore((state) => state.selectedConcept);
    const contentMap = {
        enchantment: withConcept(SidebarEnchant),
        loot_table: withConcept(SidebarLoot),
        recipe: withConcept(SidebarCrafting)
    };

    const Component = contentMap[selectedConcept as keyof typeof contentMap];
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">{Component && <Component />}</div>
        </div>
    );
}

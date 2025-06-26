
import React from "react";
import LootViewer from "@/components/tools/elements/loot/LootViewer";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { isVoxel, LootTableActionBuilder, type LootTableProps } from "@voxelio/breeze";

export default function LootMainSection() {
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));

    return (
        <div className="w-full h-full">
            {currentElement && isVoxel(currentElement, "loot_table") && (<LootViewer title={{ key: "loot_table:section.main" }}
                data={currentElement.items}
                action={(value) => new LootTableActionBuilder().removeItem(value).build()}
                renderer={(el: LootTableProps) => el.items.length}
            />)}
        </div>
    );
}

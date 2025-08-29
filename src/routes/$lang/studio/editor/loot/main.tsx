import { createFileRoute } from "@tanstack/react-router";
import { isVoxel, LootTableActionBuilder } from "@voxelio/breeze";
import type { LootTableProps } from "@voxelio/breeze/schema";
import LootViewer from "@/components/tools/elements/loot/LootViewer";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";

export const Route = createFileRoute("/$lang/studio/editor/loot/main")({
    component: LootMainPage
});

function LootMainPage() {
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    if (!currentElement || !isVoxel(currentElement, "loot_table")) return null;
    const items = currentElement.items.filter((item) => item.entryType !== "minecraft:empty");

    return (
        <div className="w-full h-full">
            {items.length > 0 && (
                <LootViewer
                    title={{ key: "loot_table:section.main" }}
                    lootTable={currentElement}
                    data={items}
                    action={(value) => new LootTableActionBuilder().removeItem(value).build()}
                    renderer={(el: LootTableProps) => el.items.length}
                />
            )}
        </div>
    );
}

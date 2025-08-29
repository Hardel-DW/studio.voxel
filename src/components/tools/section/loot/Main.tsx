import LootViewer from "@/components/tools/elements/loot/LootViewer";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { isVoxel, LootTableActionBuilder, type LootTableProps } from "@voxelio/breeze";

export default function LootMainSection() {
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    if (!currentElement || !isVoxel(currentElement, "loot_table")) return null;
    const items = currentElement.items.filter(item => item.entryType !== "minecraft:empty")

    return (
        <div className="w-full h-full">
            {items.length > 0 && (<LootViewer title={{ key: "loot_table:section.main" }}
                lootTable={currentElement}
                data={items}
                action={(value) => new LootTableActionBuilder().removeItem(value).build()}
                renderer={(el: LootTableProps) => el.items.length}
            />)}
        </div>
    );
}

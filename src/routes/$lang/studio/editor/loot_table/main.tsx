import { createFileRoute } from "@tanstack/react-router";
import type { LootTableProps } from "@voxelio/breeze";
import { isVoxel, LootTableAction } from "@voxelio/breeze";
import LootViewer from "@/components/tools/concept/loot/LootViewer";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { useFlattenedLootItems } from "@/lib/hook/useFlattenedLootItems";

export const Route = createFileRoute("/$lang/studio/editor/loot_table/main")({
    component: LootMainPage
});

function LootMainPage() {
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const lootTable = currentElement && isVoxel(currentElement, "loot_table") ? currentElement : undefined;
    const { items, isLoading } = useFlattenedLootItems(lootTable);
    if (!lootTable) return null;

    return (
        <div className="w-full h-full">
            {isLoading && <div className="p-8 text-sm text-zinc-400">Loading loot table data…</div>}
            {!isLoading && items.length > 0 && (
                <LootViewer
                    title="loot_table:section.main"
                    lootTable={lootTable}
                    data={items}
                    action={(value: string) => LootTableAction.removeLootItem(value)}
                    renderer={(el: LootTableProps) => el.items.length}
                />
            )}
        </div>
    );
}

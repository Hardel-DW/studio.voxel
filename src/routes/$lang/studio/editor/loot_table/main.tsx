import { createFileRoute } from "@tanstack/react-router";
import { isVoxel, LootTableAction, type LootItem } from "@voxelio/breeze";
import { useState } from "react";
import LootItemEditDialog, { type LootItemChanges } from "@/components/tools/concept/loot/LootItemEditDialog";
import RewardItem from "@/components/tools/concept/loot/RewardItem";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { TextInput } from "@/components/ui/TextInput";
import Translate from "@/components/ui/Translate";
import { useFlattenedLootItems } from "@/lib/hook/useFlattenedLootItems";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarButton } from "@/components/tools/floatingbar/ToolbarButton";

export const Route = createFileRoute("/$lang/studio/editor/loot_table/main")({
    component: LootMainPage
});

function LootMainPage() {
    const [searchValue, setSearchValue] = useState("");
    const [editingItem, setEditingItem] = useState<LootItem | null>(null);
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const handleChange = useConfiguratorStore((state) => state.handleChange);
    const currentElementId = useConfiguratorStore((state) => state.currentElementId);
    const lootTable = currentElement && isVoxel(currentElement, "loot_table") ? currentElement : undefined;
    const { items, isLoading } = useFlattenedLootItems(lootTable);
    if (!lootTable) return null;

    const totalProbability = items.reduce((sum, reward) => sum + reward.probability, 0);
    const filteredItems = items.filter((item) => !searchValue || item.name.toLowerCase().includes(searchValue.toLowerCase()));

    const handleDelete = (id: string) => {
        if (!currentElementId) return;
        const action = LootTableAction.removeLootItem(id);
        handleChange(action, currentElementId, id);
    };

    const handleEdit = (id: string) => {
        const item = lootTable.items.find((i) => i.id === id);
        if (item) setEditingItem(item);
    };

    const handleSaveEdit = (changes: LootItemChanges) => {
        if (!currentElementId || !editingItem) return;

        if (changes.name) {
            const action = LootTableAction.modifyLootItem(editingItem.id, "name", changes.name);
            handleChange(action, currentElementId, changes.name);
        }
        if (changes.weight !== undefined) {
            const action = LootTableAction.modifyLootItem(editingItem.id, "weight", changes.weight);
            handleChange(action, currentElementId, changes.weight);
        }
        if (changes.count) {
            const action = LootTableAction.setItemCount(editingItem.id, changes.count);
            handleChange(action, currentElementId, changes.count);
        }
    };

    if (isLoading || items.length === 0) {
        return (
            <div className="p-8 text-sm text-zinc-400">
                <Translate content={isLoading ? "loot:main.loading" : "loot:main.empty"} />
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto flex flex-col">
            <Toolbar>
                <ToolbarButton icon="/icons/tools/overview/edit.svg" tooltip="loot:pools.item.edit" onClick={() => { }} />
            </Toolbar>

            <div className="max-w-xl sticky top-0 z-30 px-8 py-4 bg-zinc-950/75 backdrop-blur-md border-b border-zinc-800/50 flex items-center gap-4">
                <TextInput value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search items..." />
            </div>

            <div className="col-span-5 flex flex-col gap-y-4 p-8">
                <div>
                    <div className="flex justify-between items-center gap-y-2">
                        <h1 className="text-2xl font-bold text-white">
                            <Translate content="loot:main.title" />
                        </h1>
                        <p className="text-sm text-zinc-400">
                            <Translate content="loot:main.probability_mass" />: {totalProbability.toFixed(2)}
                        </p>
                    </div>
                    <div className="w-full h-1 bg-zinc-700 rounded-full" />
                </div>

                <ul className="grid grid-cols-2 gap-4">
                    {filteredItems.map((reward, index) => (
                        <RewardItem
                            key={`${reward.name}-${reward.id ?? index}`}
                            {...reward}
                            normalizedProbability={totalProbability > 0 ? reward.probability / totalProbability : undefined}
                            onDelete={reward.id ? handleDelete : undefined}
                            onEdit={reward.id ? handleEdit : undefined}
                        />
                    ))}
                </ul>
            </div>

            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" />
            </div>
            <div className="absolute inset-0 -z-10 brightness-30 rotate-180">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" />
            </div>

            <LootItemEditDialog
                key={editingItem?.id}
                item={editingItem}
                open={editingItem !== null}
                onClose={() => setEditingItem(null)}
                onSave={handleSaveEdit}
            />
        </div>
    );
}

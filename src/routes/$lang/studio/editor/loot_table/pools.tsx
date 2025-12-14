import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Identifier, isVoxel, LootTableAction, type LootItem } from "@voxelio/breeze";
import { useState } from "react";
import LootItemEditDialog, { type LootItemChanges } from "@/components/tools/concept/loot/LootItemEditDialog";
import PoolSection from "@/components/tools/concept/loot/PoolSection";
import ItemSelector from "@/components/tools/elements/gui/ItemSelector";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import { Button } from "@/components/ui/Button";
import Translate from "@/components/ui/Translate";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarButton } from "@/components/tools/floatingbar/ToolbarButton";

export const Route = createFileRoute("/$lang/studio/editor/loot_table/pools")({
    component: PoolsPage
});

function PoolsPage() {
    const [editingItem, setEditingItem] = useState<LootItem | null>(null);
    const { lang } = useParams({ from: "/$lang" });
    const navigate = useNavigate();
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const handleChange = useConfiguratorStore((state) => state.handleChange);
    const currentElementId = useConfiguratorStore((state) => state.currentElementId);
    const getRegistry = useConfiguratorStore((state) => state.getRegistry);
    const setCurrentElementId = useConfiguratorStore((state) => state.setCurrentElementId);
    const { expand, collapse } = useDynamicIsland();

    const lootTable = currentElement && isVoxel(currentElement, "loot_table") ? currentElement : undefined;
    const lootTables = getRegistry("loot_table");
    if (!lootTable) return null;

    const poolCount = Math.max(
        ...lootTable.items.map((i) => i.poolIndex + 1),
        ...lootTable.groups.map((g) => g.poolIndex + 1),
        lootTable.pools?.length ?? 0,
        1
    );

    const itemsByPool = Map.groupBy(lootTable.items, (item) => item.poolIndex);

    const handleAddItem = (poolIndex: number) => {
        const getItems = () => getRegistry("item").map((el) => el.identifier.toString());

        expand(
            <ItemSelector
                currentItem=""
                onItemSelect={(itemName) => {
                    if (!currentElementId) return;
                    const action = LootTableAction.addLootItem(poolIndex, { name: itemName, weight: 1 });
                    handleChange(action, currentElementId, itemName);
                    collapse();
                }}
                items={getItems}
            />
        );
    };

    const handleEditItem = (id: string) => {
        const item = lootTable.items.find((i) => i.id === id);
        if (item) setEditingItem(item);
    };

    const handleDeleteItem = (id: string) => {
        if (!currentElementId) return;
        const action = LootTableAction.removeLootItem(id);
        handleChange(action, currentElementId, id);
    };

    const handleWeightChange = (id: string, weight: number) => {
        if (!currentElementId) return;
        const action = LootTableAction.modifyLootItem(id, "weight", weight);
        handleChange(action, currentElementId, weight);
    };

    const handleBalanceWeights = (poolIndex: number) => {
        if (!currentElementId) return;
        const action = LootTableAction.balanceWeights(poolIndex);
        handleChange(action, currentElementId, poolIndex);
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

    const handleAddPool = () => {
        if (!currentElementId) return;
        const newPoolIndex = poolCount;
        const action = LootTableAction.addLootItem(newPoolIndex, { name: "minecraft:stone", weight: 1 });
        handleChange(action, currentElementId, newPoolIndex);
    };

    const handleNavigate = (name: string) => {
        const targetId = Identifier.of(name, "loot_table");
        const target = lootTables.find((lt) => new Identifier(lt.identifier).equals(targetId));
        if (!target) return;
        setCurrentElementId(new Identifier(target.identifier).toUniqueKey());
        navigate({ to: "/$lang/studio/editor/loot_table/pools", params: { lang } });
    };

    return (
        <div className="h-full overflow-y-auto flex flex-col">
            <Toolbar>
                <ToolbarButton icon="/icons/tools/overview/edit.svg" tooltip="loot:pools.item.edit" onClick={() => { }} />
            </Toolbar>

            <div className="sticky top-0 z-30 px-8 py-4 bg-zinc-950/75 backdrop-blur-md border-b border-zinc-800/50 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">
                    <Translate content="loot:pools.title" />
                </h1>
                <Button variant="default" onClick={handleAddPool}>
                    <Translate content="loot:pools.add_pool" />
                </Button>
            </div>

            <div className="flex flex-col gap-6 p-8">
                {Array.from({ length: poolCount }, (_, poolIndex) => {
                    const poolItems = itemsByPool.get(poolIndex) ?? [];
                    const poolData = lootTable.pools?.find((p) => p.poolIndex === poolIndex);

                    return (
                        <PoolSection
                            key={poolIndex.toString()}
                            poolIndex={poolIndex}
                            poolData={poolData}
                            items={poolItems}
                            onAddItem={handleAddItem}
                            onEditItem={handleEditItem}
                            onDeleteItem={handleDeleteItem}
                            onWeightChange={handleWeightChange}
                            onBalanceWeights={handleBalanceWeights}
                            onNavigate={handleNavigate}
                        />
                    );
                })}
            </div>

            <div className="absolute inset-0 -z-10 brightness-30">
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

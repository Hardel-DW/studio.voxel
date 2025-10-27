import { createFileRoute } from "@tanstack/react-router";
import { isVoxel, LootTableAction } from "@voxelio/breeze";
import { useState } from "react";
import RewardItem from "@/components/tools/concept/loot/RewardItem";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarSearch } from "@/components/tools/floatingbar/ToolbarSearch";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/ui/Translate";
import { useFlattenedLootItems } from "@/lib/hook/useFlattenedLootItems";

export const Route = createFileRoute("/$lang/studio/editor/loot_table/main")({
    component: LootMainPage
});

function LootMainPage() {
    const [searchValue, setSearchValue] = useState("");
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

    return (
        <div className="w-full h-full">
            <Toolbar>
                <ToolbarSearch placeholder="loot:main.search.placeholder" value={searchValue} onChange={setSearchValue} />
            </Toolbar>

            {isLoading && (
                <div className="p-8 text-sm text-zinc-400">
                    <Translate content="loot:main.loading" />
                </div>
            )}
            {!isLoading && items.length > 0 && (
                <div className="relative overflow-hidden bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 rounded-xl w-full min-h-full">
                    <div className="overflow-y-auto col-span-5 flex flex-col gap-y-4 p-8">
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
                                />
                            ))}
                        </ul>
                    </div>

                    <div className="absolute inset-0 -z-10 brightness-30">
                        <img src="/images/shine.avif" alt="Shine" />
                    </div>
                    <div className="absolute inset-0 -z-10 brightness-30 rotate-180">
                        <img src="/images/shine.avif" alt="Shine" />
                    </div>
                </div>
            )}
        </div>
    );
}

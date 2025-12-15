import { calculateItemCountRange, Identifier, type LootItem, LootTableAction } from "@voxelio/breeze";
import { useState } from "react";
import ItemSelector from "@/components/tools/elements/gui/ItemSelector";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import { useConfiguratorStore } from "@/components/tools/Store";
import { Button } from "@/components/ui/Button";
import { useClickOutside } from "@/lib/hook/useClickOutside";
import useRegistry from "@/lib/hook/useRegistry";

interface LootItemEditorProps {
    item: LootItem;
}

export default function LootItemEditor({ item }: LootItemEditorProps) {
    const countRange = calculateItemCountRange(item.functions);
    const [name, setName] = useState(item.name);
    const [weight, setWeight] = useState(item.weight ?? 1);
    const [countMin, setCountMin] = useState(countRange.min);
    const [countMax, setCountMax] = useState(countRange.max);
    const [selectingItem, setSelectingItem] = useState(false);
    const handleChange = useConfiguratorStore((state) => state.handleChange);
    const currentElementId = useConfiguratorStore((state) => state.currentElementId);
    const { data } = useRegistry<string[]>("registry", "item");
    const items = data?.filter((i) => i !== "air").map((i) => Identifier.of(i, "item").toString());
    const { collapse, resize } = useDynamicIsland();
    const ref = useClickOutside(() => !selectingItem && collapse());

    const handleNameChange = (newName: string) => {
        setName(newName);
        setSelectingItem(false);
        resize("fit");
        if (!currentElementId) return;
        handleChange(LootTableAction.modifyLootItem(item.id, "name", newName), currentElementId, newName);
    };

    const openItemSelector = () => {
        resize("large");
        setSelectingItem(true);
    };

    const handleWeightChange = (newWeight: number) => {
        const value = Math.max(1, newWeight);
        setWeight(value);
        if (!currentElementId) return;
        handleChange(LootTableAction.modifyLootItem(item.id, "weight", value), currentElementId, value);
    };

    const handleCountChange = (min: number, max: number) => {
        const validMin = Math.max(1, min);
        const validMax = Math.max(validMin, max);
        setCountMin(validMin);
        setCountMax(validMax);
        if (!currentElementId) return;
        handleChange(LootTableAction.setItemCount(item.id, { min: validMin, max: validMax }), currentElementId, {
            min: validMin,
            max: validMax
        });
    };

    const handleDelete = () => {
        if (!currentElementId) return;
        handleChange(LootTableAction.removeLootItem(item.id), currentElementId, item.id);
        collapse();
    };

    if (selectingItem) {
        return <ItemSelector currentItem={name} onItemSelect={handleNameChange} items={items} />;
    }

    return (
        <div ref={ref} className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-300">Edit Loot Item</h3>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6m4-6v6" />
                    </svg>
                </button>
            </div>

            <div className="flex gap-6">
                <button
                    type="button"
                    onClick={openItemSelector}
                    className="flex flex-col items-center gap-2 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors cursor-pointer group">
                    <TextureRenderer id={name} size={48} className="size-12" />
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">Change</span>
                </button>

                <div className="flex flex-col gap-4 flex-1">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">Weight</span>
                        <div className="flex items-center bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
                            <button
                                type="button"
                                onClick={() => handleWeightChange(weight - 1)}
                                className="px-3 py-2 hover:bg-zinc-800 transition-colors text-zinc-400 cursor-pointer">
                                -
                            </button>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => handleWeightChange(Number(e.target.value))}
                                min={1}
                                className="flex-1 px-2 py-2 bg-transparent text-white text-center text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                                type="button"
                                onClick={() => handleWeightChange(weight + 1)}
                                className="px-3 py-2 hover:bg-zinc-800 transition-colors text-zinc-400 cursor-pointer">
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <span className="text-xs text-zinc-500 uppercase tracking-wider">Count Min</span>
                            <input
                                type="number"
                                value={countMin}
                                onChange={(e) => handleCountChange(Number(e.target.value), countMax)}
                                min={1}
                                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <span className="text-xs text-zinc-500 uppercase tracking-wider">Count Max</span>
                            <input
                                type="number"
                                value={countMax}
                                onChange={(e) => handleCountChange(countMin, Number(e.target.value))}
                                min={countMin}
                                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-auto pt-4 border-t border-zinc-800">
                <Button onClick={collapse} variant="ghost_border" size="sm">
                    Close
                </Button>
            </div>
        </div>
    );
}

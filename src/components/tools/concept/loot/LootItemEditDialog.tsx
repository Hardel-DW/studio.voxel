import { useState } from "react";
import { calculateItemCountRange, type LootItem } from "@voxelio/breeze";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import ItemSelector from "@/components/tools/elements/gui/ItemSelector";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import { Button } from "@/components/ui/Button";
import Translate from "@/components/ui/Translate";
import { useConfiguratorStore } from "@/components/tools/Store";
import { cn } from "@/lib/utils";

export interface LootItemChanges {
    name?: string;
    weight?: number;
    count?: { min: number; max: number };
}

interface LootItemEditDialogProps {
    item: LootItem | null;
    open: boolean;
    onClose: () => void;
    onSave: (changes: LootItemChanges) => void;
}

export default function LootItemEditDialog({ item, open, onClose, onSave }: LootItemEditDialogProps) {
    const countRange = item ? calculateItemCountRange(item.functions) : { min: 1, max: 1 };
    const [name, setName] = useState(item?.name ?? "");
    const [weight, setWeight] = useState(item?.weight ?? 1);
    const [countMin, setCountMin] = useState(countRange.min);
    const [countMax, setCountMax] = useState(countRange.max);
    const { expand, collapse } = useDynamicIsland();

    const getRegistry = useConfiguratorStore((state) => state.getRegistry);
    const getItems = () => getRegistry("item").map((el) => el.identifier.toString());

    const resetForm = () => {
        if (item) {
            const range = calculateItemCountRange(item.functions);
            setName(item.name);
            setWeight(item.weight ?? 1);
            setCountMin(range.min);
            setCountMax(range.max);
        }
    };

    const handleSave = () => {
        if (!item) return;
        const changes: LootItemChanges = {};

        if (name !== item.name) changes.name = name;
        if (weight !== item.weight) changes.weight = weight;
        if (countMin !== countRange.min || countMax !== countRange.max) {
            changes.count = { min: countMin, max: countMax };
        }

        onSave(changes);
        onClose();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const openItemSelector = () => {
        expand(
            <ItemSelector
                currentItem={name}
                onItemSelect={(id) => {
                    setName(id);
                    collapse();
                }}
                items={getItems}
            />
        );
    };

    if (!open || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <button type="button" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
            <div
                className={cn(
                    "relative z-10 w-[500px] rounded-xl bg-zinc-950 shadow-lg shadow-neutral-950 p-6 border border-zinc-800"
                )}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">
                        <Translate content="loot:item.edit_title" />
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="item-selector" className="text-sm font-medium text-zinc-400">
                            <Translate content="loot:item.select_item" />
                        </label>
                        <button
                            type="button"
                            onClick={openItemSelector}
                            className="flex items-center gap-3 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors cursor-pointer">
                            <TextureRenderer id={name} className="size-8" />
                            <span className="text-white text-sm">{name}</span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="weight-input" className="text-sm font-medium text-zinc-400">
                            <Translate content="loot:item.weight" />
                        </label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Math.max(1, Number(e.target.value)))}
                            min={1}
                            className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-600"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="count-input" className="text-sm font-medium text-zinc-400">
                            <Translate content="loot:item.count" />
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label htmlFor="count-min-input" className="text-xs text-zinc-500 mb-1 block">
                                    <Translate content="loot:item.count_min" />
                                </label>
                                <input
                                    type="number"
                                    value={countMin}
                                    onChange={(e) => setCountMin(Math.max(1, Number(e.target.value)))}
                                    min={1}
                                    className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-600"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="count-max-input" className="text-xs text-zinc-500 mb-1 block">
                                    <Translate content="loot:item.count_max" />
                                </label>
                                <input
                                    type="number"
                                    value={countMax}
                                    onChange={(e) => setCountMax(Math.max(countMin, Number(e.target.value)))}
                                    min={countMin}
                                    className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
                    <Button variant="ghost_border" onClick={handleClose}>
                        <Translate content="loot:item.cancel" />
                    </Button>
                    <Button variant="default" onClick={handleSave}>
                        <Translate content="loot:item.save" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

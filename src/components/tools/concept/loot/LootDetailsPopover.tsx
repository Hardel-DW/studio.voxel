import type { LootTableProps } from "@voxelio/breeze";
import type { ReactElement } from "react";
import LootItemHoverCard from "@/components/tools/concept/loot/LootItemHoverCard";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useFlattenedLootItems } from "@/lib/hook/useFlattenedLootItems";

interface LootDetailsPopoverProps {
    element: LootTableProps;
    trigger: ReactElement<{ ref?: React.Ref<HTMLElement>; onClick?: () => void; className?: string }>;
    onOpenChange?: (isOpen: boolean) => void;
}

export default function LootDetailsPopover({ element, trigger, onOpenChange }: LootDetailsPopoverProps) {
    const { items, isLoading } = useFlattenedLootItems(element);
    const itemsCount = items.length;
    const rollsInfo = getRollsInfo(element);

    return (
        <Popover className="loot-popover" onOpenChange={onOpenChange}>
            <PopoverTrigger>{trigger}</PopoverTrigger>
            <PopoverContent className="max-w-100 max-h-120">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold leading-2">Loot Items</p>
                        <div className="flex gap-2 items-center">
                            <span className="text-xs bg-zinc-900/50 border border-zinc-800 px-2 rounded-lg">
                                {rollsInfo} rolls
                            </span>
                            <span className="text-xs bg-zinc-900/50 border border-zinc-800 px-2 rounded-lg">
                                {itemsCount} items
                            </span>
                        </div>
                    </div>

                    <hr />

                    {/* Grid des items */}
                    <div className="overflow-y-auto max-h-96">
                        {isLoading ? (
                            <div className="py-8 text-center text-xs text-zinc-400">Loading loot data…</div>
                        ) : items.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {items.map((item, index) => (
                                    <LootItemHoverCard key={`${item.name}-${index}-${item.path.join("-")}`} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-zinc-400">
                                <div className="text-sm">No items in this loot table</div>
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// Fonction utilitaire pour extraire les infos de rolls
export function getRollsInfo(element: LootTableProps): string {
    if (!element.pools || element.pools.length === 0) {
        return "No pools";
    }

    if (element.pools.length === 1) {
        const pool = element.pools[0];
        if (typeof pool.rolls === "number") {
            return `${pool.rolls} rolls`;
        }
        if (typeof pool.rolls === "object" && pool.rolls.min !== undefined && pool.rolls.max !== undefined) {
            return `${pool.rolls.min}-${pool.rolls.max} rolls`;
        }
        return "Variable rolls";
    }

    return `${element.pools.length} pools`;
}

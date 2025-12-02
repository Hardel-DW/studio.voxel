import { Link, useParams } from "@tanstack/react-router";
import type { LootTableProps } from "@voxelio/breeze";
import { CoreAction, Identifier } from "@voxelio/breeze";
import { useRef } from "react";
import LootItemHoverCard from "@/components/tools/concept/loot/LootItemHoverCard";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useConfiguratorStore } from "@/components/tools/Store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useFlattenedLootItems } from "@/lib/hook/useFlattenedLootItems";
import { cn } from "@/lib/utils";

export default function LootOverviewCard(props: { element: LootTableProps; elementId: string }) {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const { lang } = useParams({ from: "/$lang" });
    const rollsInfo = getRollsInfo(props.element);
    const { items, isLoading } = useFlattenedLootItems(props.element);
    const itemsCount = items.length;

    const handleConfigure = () => useConfiguratorStore.getState().setCurrentElementId(props.elementId);
    const handlePopoverChange = (isOpen: boolean) => {
        if (!cardRef.current) return;
        cardRef.current.toggleAttribute("data-popover-open", isOpen);
    };

    return (
        <div
            ref={cardRef}
            data-element-id={props.elementId}
            className={cn(
                "overview-card bg-zinc-950/70 border border-zinc-900 select-none relative rounded-xl p-4 shadow-sm",
                "flex flex-col",
                "outline-hidden",
                "transition-[box-shadow,transform] duration-150 ease-out hover:shadow-lg hover:-translate-y-0.5"
            )}>
            {/* Première ligne : Titre/Badge/Switch */}
            <div className="flex items-center justify-between pb-3">
                <div className="flex flex-col gap-1 justify-center flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{new Identifier(props.element.identifier).toResourceName()}</h3>
                    <div className="flex items-center gap-2 text-zinc-400">
                        <div className="bg-zinc-800/20 pr-2 pl-1 py-px rounded-full border border-zinc-800">
                            <div className="flex items-center gap-1">
                                <span className="text-xs">🎲</span>
                                <span className="text-xs tracking-wider text-zinc-400 font-medium">{rollsInfo}</span>
                            </div>
                        </div>

                        {/* Badge Items */}
                        <div className="bg-zinc-800/20 pr-2 pl-1 py-px rounded-full border border-zinc-800">
                            <div className="flex items-center gap-1">
                                <span className="text-xs">📦</span>
                                <span className="text-xs tracking-wider text-zinc-400 font-medium">{itemsCount} items</span>
                            </div>
                        </div>
                    </div>
                </div>

                <SimpleSwitch elementId={props.elementId} action={CoreAction.invertBoolean("disabled")} renderer={(el) => !el.disabled} />
            </div>

            {/* Deuxième ligne : Items empilés */}
            <div className="pb-4">
                <div className="relative w-full flex justify-between items-center cursor-pointer">
                    <div className="flex -space-x-3">
                        {items.slice(0, 5).map((item, index) => (
                            <TextureRenderer key={`${item.name}-${index}`} id={item.name} className="size-10 scale-75 drop-shadow-sm" />
                        ))}
                    </div>
                    <Popover className="loot-popover" onOpenChange={handlePopoverChange}>
                        <PopoverTrigger>
                            <span className="text-xs bg-zinc-900/60 border border-zinc-800 px-2 py-2 rounded-lg cursor-pointer hover:bg-zinc-800/60 transition-colors">
                                {itemsCount > 5 ? `+${itemsCount - 5} more` : "See Details"}
                            </span>
                        </PopoverTrigger>
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
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-800/50 mt-auto">
                <Link
                    to="/$lang/studio/editor/loot_table/main"
                    params={{ lang }}
                    onClick={handleConfigure}
                    className="w-full cursor-pointer bg-zinc-900/40 hover:bg-zinc-800/50 border border-zinc-800/40 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-[background-color] duration-150 block text-center">
                    Configure
                </Link>
            </div>
        </div>
    );
}

// Fonction utilitaire pour extraire les infos de rolls
function getRollsInfo(element: LootTableProps): string {
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

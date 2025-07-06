import { cn } from "@/lib/utils";
import { Actions, Identifier } from "@voxelio/breeze";
import type { LootTableProps } from "@voxelio/breeze/schema";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useConfiguratorStore } from "@/components/tools/Store";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import LootItemHoverCard from "./LootItemHoverCard";

export default function LootOverviewCard(props: {
    element: LootTableProps;
    elementId: string;
    isBlurred: boolean;
    onPopoverChange: (isOpen: boolean) => void;
}) {
    const setCurrentElementId = useConfiguratorStore((state) => state.setCurrentElementId);
    const rollsInfo = getRollsInfo(props.element);
    const itemsCount = props.element.items.filter(item => item.entryType !== "minecraft:empty").length;
    const items = props.element.items.filter(item => item.entryType !== "minecraft:empty");

    return (
        <div
            className={cn(
                "bg-black/50 border-t-2 border-l-2 border-stone-900 select-none relative transition-all hover:ring-1 ring-zinc-900 rounded-xl p-4",
                "flex flex-col",
                props.isBlurred && "grayscale brightness-50 blur-sm transition-all duration-300 select-none pointer-events-none"
            )}>

            {/* Première ligne : Titre/Badge/Switch */}
            <div className="flex items-center justify-between pb-3">
                <div className="flex flex-col gap-1 justify-center flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">
                        {new Identifier(props.element.identifier).toResourceName()}
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="bg-zinc-800/20 pr-2 pl-1 py-px rounded-full border border-zinc-800">
                            <div className="flex items-center gap-1">
                                <span className="text-xs">🎲</span>
                                <span className="text-xs tracking-wider text-zinc-400 font-medium">
                                    {rollsInfo}
                                </span>
                            </div>
                        </div>

                        {/* Badge Items */}
                        <div className="bg-zinc-800/20 pr-2 pl-1 py-px rounded-full border border-zinc-800">
                            <div className="flex items-center gap-1">
                                <span className="text-xs">📦</span>
                                <span className="text-xs tracking-wider text-zinc-400 font-medium">
                                    {itemsCount} items
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <SimpleSwitch
                    elementId={props.elementId}
                    action={new Actions().invertBoolean("disabled").build()}
                    renderer={(el) => !el.disabled}
                />
            </div>

            {/* Deuxième ligne : Items empilés */}
            <div className="pb-4">
                <div className="relative w-full flex justify-between items-center cursor-pointer">
                    <div className="flex -space-x-4">
                        {items.slice(0, 5).map((item) => (
                            <TextureRenderer key={item.id} id={item.name} className="scale-75" />
                        ))}
                    </div>
                    <Popover onOpenChange={props.onPopoverChange}>
                        <PopoverTrigger>
                            <span className="text-xs bg-zinc-900/50 border border-zinc-800 px-2 py-2 rounded-lg cursor-pointer hover:bg-zinc-800/50 transition-colors">
                                {items.length > 5 ? `+${items.length - 5} more` : "See Details"}
                            </span>
                        </PopoverTrigger>
                        <PopoverContent className="max-w-100 max-h-120">
                            <div className="absolute inset-0 z-0 hue-rotate-45 starting:opacity-0 transition-all duration-500 brightness-20">
                                <img src="/images/shine.avif" alt="Shine" />
                            </div>

                            <div className="flex flex-col gap-2 relative z-20">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold leading-2">Loot Items</p>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-xs bg-zinc-900/50 border border-zinc-800 px-2 rounded-lg">{rollsInfo} rolls</span>
                                        <span className="text-xs bg-zinc-900/50 border border-zinc-800 px-2 rounded-lg">{itemsCount} items</span>
                                    </div>
                                </div>

                                <hr className="!my-0" />

                                {/* Grid des items */}
                                <div className="overflow-y-auto max-h-96">
                                    <div className="grid grid-cols-2 gap-2">
                                        {items.map((item) => (
                                            <LootItemHoverCard key={item.id} item={item} />
                                        ))}
                                    </div>

                                    {items.length === 0 && (
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
                <button
                    onClick={() => setCurrentElementId(props.elementId)}
                    onKeyDown={() => setCurrentElementId(props.elementId)}
                    type="button"
                    className="w-full cursor-pointer bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-colors">
                    Configure
                </button>
            </div>

            {/* Background shine */}
            <div className="absolute inset-0 -z-10 brightness-30 rounded-xl overflow-hidden">
                <img src="/images/shine.avif" alt="Shine" className="w-full h-full object-cover" />
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

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SlotsEnchantmentCard from "@/components/tools/concept/enchantment/SlotsEnchantmentCard";
import { SLOT_CONFIGS } from "@/components/tools/concept/enchantment/slots";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarSearch } from "@/components/tools/floatingbar/ToolbarSearch";
import { ToolbarTextLink } from "@/components/tools/floatingbar/ToolbarTextLink";
import Translate from "@/components/tools/Translate";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/slots-overview")({
    component: Page
});

function Page() {
    const { lang } = Route.useParams();
    const [searchValue, setSearchValue] = useState("");
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const enchantmentElements = useElementsByType("enchantment");

    const filteredElements = enchantmentElements.filter((element) => {
        if (searchValue && !element.identifier.resource.toLowerCase().includes(searchValue.toLowerCase())) {
            return false;
        }

        if (selectedSlots.length > 0) {
            return selectedSlots.every((slotId) => {
                const slotFilter = SLOT_CONFIGS.find((f) => f.id === slotId);
                return slotFilter && element.slots.some((slot) => slotFilter.slots.includes(slot));
            });
        }

        return true;
    });

    const toggleSlotFilter = (slotId: string) =>
        setSelectedSlots((prev) => (prev.includes(slotId) ? prev.filter((id) => id !== slotId) : [...prev, slotId]));
    const clearAllFilters = () => setSelectedSlots([]);

    return (
        <div>
            <Toolbar>
                <div className="flex items-center gap-1">
                    <ToolbarTextLink
                        icon="/icons/tools/overview/home.svg"
                        tooltip="enchantment:slots.toolbar.back"
                        labelText="enchantment:slots.toolbar.back"
                        lang={lang}
                        to="/$lang/studio/editor/enchantment/overview"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <ToolbarSearch placeholder="enchantment:overview.search.placeholder" value={searchValue} onChange={setSearchValue} />
                    {selectedSlots.length > 0 && (
                        <button
                            type="button"
                            onClick={clearAllFilters}
                            className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded transition-colors">
                            <Translate content="enchantment:slots.clear_filters" />
                        </button>
                    )}
                </div>
            </Toolbar>

            {/* Header of filtering by slots */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-zinc-300">
                            <Translate content="enchantment:slots.filter.title" />
                        </h2>
                        <span className="text-sm text-zinc-500">
                            {selectedSlots.length > 0 && <Translate content="enchantment:slots.filter.active_count" />} (
                            {selectedSlots.length})
                        </span>
                    </div>
                    <span className="text-xs text-zinc-500">
                        <Translate content="enchantment:slots.filter.description" />
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    {/* Left: mainhand, offhand */}
                    <div className="flex items-center gap-3">
                        {SLOT_CONFIGS.slice(0, 2).map((slot) => (
                            <button
                                key={slot.id}
                                type="button"
                                onClick={() => toggleSlotFilter(slot.id)}
                                className={cn(
                                    "bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 select-none cursor-pointer relative transition-all hover:ring-1 p-2 rounded-md w-12 h-12 flex items-center justify-center",
                                    { "bg-zinc-950/25 ring-1 ring-zinc-600": selectedSlots.includes(slot.id) }
                                )}
                                title={slot.name}>
                                <img src={slot.image} alt={slot.name} className="pixelated" style={{ height: "24px" }} />
                                <div className="absolute inset-0 -z-10 brightness-30 rounded-md overflow-hidden">
                                    <img src="/images/shine.avif" alt="Shine" />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right: body, saddle, armor slots */}
                    <div className="flex items-center gap-3">
                        {SLOT_CONFIGS.slice(2).map((slot) => (
                            <button
                                key={slot.id}
                                type="button"
                                onClick={() => toggleSlotFilter(slot.id)}
                                className={cn(
                                    "bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 select-none cursor-pointer relative transition-all hover:ring-1 p-2 rounded-md w-12 h-12 flex items-center justify-center",
                                    { "bg-zinc-950/25 ring-1 ring-zinc-600": selectedSlots.includes(slot.id) }
                                )}
                                title={slot.name}>
                                <img src={slot.image} alt={slot.name} className="pixelated" style={{ height: "24px" }} />
                                <div className="absolute inset-0 -z-10 brightness-30 rounded-md overflow-hidden">
                                    <img src="/images/shine.avif" alt="Shine" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <hr className="my-4 border-zinc-800/50" />

            {/* Results */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-zinc-400">
                    {filteredElements.length} <Translate content="enchantment:overview.results" />
                    {selectedSlots.length > 0 && (
                        <span className="ml-2 text-zinc-500">
                            (<Translate content="enchantment:slots.filter.filtered" />)
                        </span>
                    )}
                </p>
            </div>

            {/* Grid of cards */}
            <div className="grid gap-4 overview-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {filteredElements.map((element) => (
                    <SlotsEnchantmentCard key={element.identifier.resource} element={element} />
                ))}
            </div>

            {filteredElements.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="text-lg font-medium text-zinc-300 mb-2">
                        <Translate content="enchantment:slots.no_results.title" />
                    </h3>
                    <p className="text-sm text-zinc-500">
                        <Translate content="enchantment:slots.no_results.description" />
                    </p>
                </div>
            )}
        </div>
    );
}

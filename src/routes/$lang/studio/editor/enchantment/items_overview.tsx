import { createFileRoute } from "@tanstack/react-router";
import type { SingleOrMultiple } from "@voxelio/breeze";
import { separateItemsAndTags } from "@voxelio/breeze";
import { useState } from "react";
import EnchantmentCard from "@/components/tools/concept/enchantment/EnchantmentCard";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarSearch } from "@/components/tools/floatingbar/ToolbarSearch";
import { ToolbarTextLink } from "@/components/tools/floatingbar/ToolbarTextLink";
import Translate from "@/components/ui/Translate";
import { enchantableEntries } from "@/lib/data/tags";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/items_overview")({
    component: Page
});
const extractTags = (value: SingleOrMultiple<string>) => (!value ? [] : separateItemsAndTags(value).tags);

function Page() {
    const { lang } = Route.useParams();
    const [searchValue, setSearchValue] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const enchantmentElements = useElementsByType("enchantment");

    const toggleTag = (tag: string) => setSelectedTag((prev) => (prev === tag ? null : tag));
    const clearFilters = () => setSelectedTag(null);

    const filteredElements = enchantmentElements.filter((element) => {
        const loweredSearch = searchValue.trim().toLowerCase();
        if (loweredSearch && !element.identifier.resource.toLowerCase().includes(loweredSearch)) {
            return false;
        }

        if (!selectedTag) return true;
        const supportedTags = extractTags(element.supportedItems);
        const primaryTags = extractTags(element.primaryItems ?? []);
        const elementTags = new Set<string>([...supportedTags, ...primaryTags, ...(element.tags ?? [])]);
        return elementTags.has(selectedTag);
    });

    return (
        <div>
            <Toolbar>
                <div className="flex items-center gap-1">
                    <ToolbarTextLink
                        icon="/icons/tools/overview/home.svg"
                        tooltip="enchantment:items.toolbar.back"
                        labelText="enchantment:items.toolbar.back"
                        lang={lang}
                        to="/$lang/studio/editor/enchantment/overview"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <ToolbarSearch placeholder="enchantment:overview.search.placeholder" value={searchValue} onChange={setSearchValue} />
                    {selectedTag && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded transition-colors">
                            <Translate content="enchantment:items.filter.clear" />
                        </button>
                    )}
                </div>
            </Toolbar>

            <div className="mb-6 space-y-4">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-300">
                        <Translate content="enchantment:items.filter.title" />
                    </h2>
                    <span className="text-sm text-zinc-500 max-w-2xl">
                        <Translate content="enchantment:items.filter.description" />
                    </span>
                </div>

                <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(80px,1fr))]">
                    {enchantableEntries.map(([key, identifier]) => {
                        const tag = identifier.toString();
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={cn(
                                    "flex flex-col justify-between items-center p-4 gap-4 bg-black/40 border border-stone-900 rounded-lg transition-all hover:ring-1 ring-zinc-900 cursor-pointer",
                                    selectedTag === tag && "bg-zinc-950/40 ring-1 ring-zinc-600"
                                )}>
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <img src={`/images/features/item/${key}.webp`} alt={key} className="pixelated h-12" />
                                </div>
                                <span className="text-[11px] text-zinc-400 text-center leading-tight">
                                    <Translate content={`enchantment:supported.${key}.title`} />
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <hr className="my-4 border-zinc-800/50" />

            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-zinc-400">
                    {filteredElements.length} <Translate content="enchantment:overview.results" />
                    {selectedTag && (
                        <span className="ml-2 text-zinc-500">
                            (<Translate content="enchantment:items.filter.filtered" />)
                        </span>
                    )}
                </p>
            </div>

            <div className="grid gap-4 overview-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {filteredElements.map((element) => (
                    <EnchantmentCard key={element.identifier.resource} element={element} display />
                ))}
            </div>

            {filteredElements.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="text-lg font-medium text-zinc-300 mb-2">
                        <Translate content="enchantment:items.no_results.title" />
                    </h3>
                    <p className="text-sm text-zinc-500">
                        <Translate content="enchantment:items.no_results.description" />
                    </p>
                </div>
            )}
        </div>
    );
}

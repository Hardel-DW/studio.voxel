import { createFileRoute } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import EnchantmentCard from "@/components/tools/concept/enchantment/EnchantmentCard";
import { SLOT_CONFIGS } from "@/components/tools/concept/enchantment/slots";
import { TextInput } from "@/components/ui/TextInput";
import Translate from "@/components/ui/Translate";
import { enchantableEntries } from "@/lib/data/tags";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/overview")({
    component: OverviewPage
});

function OverviewPage() {
    const { search, setSearch, sidebarView, filterPath, viewMode } = useEditorUiStore();
    const elements = useElementsByType("enchantment");

    const filteredElements = elements.filter((element) => {
        if (search && !element.identifier.resource.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }

        if (filterPath) {
            const parts = filterPath.split("/");
            const category = parts[0];
            const leaf = parts.length > 1 ? parts[1] : null;
            if (leaf) {
                const resourceName = new Identifier(element.identifier).toResourceName();
                return resourceName === leaf;
            }

            if (sidebarView === "slots") {
                const slotConfig = SLOT_CONFIGS.find((s) => s.id === category);
                if (slotConfig) {
                    return element.slots.some((s) => slotConfig.slots.includes(s));
                }
            } else if (sidebarView === "items") {
                const entry = enchantableEntries.find(([k]) => k === category);
                if (entry) {
                    const tag = entry[1].toString();
                    const supported = Array.isArray(element.supportedItems) ? element.supportedItems : [element.supportedItems];
                    const primary = element.primaryItems
                        ? Array.isArray(element.primaryItems)
                            ? element.primaryItems
                            : [element.primaryItems]
                        : [];
                    const allTags = [...supported, ...primary, ...(element.tags || [])];
                    return allTags.includes(tag);
                }
            } else if (sidebarView === "exclusive") {
                if (element.exclusiveSet) {
                    const sets = Array.isArray(element.exclusiveSet) ? element.exclusiveSet : [element.exclusiveSet];
                    const setName = category;
                    return sets.some((s) => {
                        const sName = s.startsWith("#") ? s : Identifier.toDisplay(s);
                        return sName === setName;
                    });
                }
                return false;
            }
        }

        return true;
    });

    const { visibleItems, hasMore, ref } = useInfiniteScroll(filteredElements, 24);

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="max-w-xl sticky top-0 z-30 px-8 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 flex flex-col gap-4">
                <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search enchantments..." />
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-zinc-950/50">
                {visibleItems.length > 0 ? (
                    <div
                        className={cn(
                            "grid gap-4 pb-20",
                            viewMode === "grid" ? "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]" : "grid-cols-1"
                        )}>
                        {visibleItems.map((element) => (
                            <EnchantmentCard key={element.identifier.resource} element={element} display={viewMode === "list"} />
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center pb-20 opacity-60">
                        <div className="size-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                            <img src="/icons/search.svg" className="size-10 opacity-20 invert" alt="No results" />
                        </div>
                        <h3 className="text-xl font-medium text-zinc-300 mb-2">
                            <Translate content="enchantment:items.no_results.title" />
                        </h3>
                        <p className="text-zinc-500 max-w-sm text-center">
                            <Translate content="enchantment:items.no_results.description" />
                        </p>
                    </div>
                )}

                {hasMore && (
                    <div ref={ref} className="flex justify-center items-center py-8">
                        <div className="flex items-center gap-2 text-zinc-500 text-xs">
                            <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

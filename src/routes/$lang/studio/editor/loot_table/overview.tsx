import { createFileRoute } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { useState } from "react";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import LootOverviewCard from "@/components/tools/concept/loot/LootOverviewCard";
import { TextInput } from "@/components/ui/TextInput";
import Translate from "@/components/ui/Translate";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { useFlattenedLootCache } from "@/lib/hook/useFlattenedLootItems";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";
import { cn } from "@/lib/utils";
import { matchesPath } from "@/lib/utils/tree";

export const Route = createFileRoute("/$lang/studio/editor/loot_table/overview")({
    component: RouteComponent
});

function RouteComponent() {
    const { filterPath, search, setSearch, viewMode } = useEditorUiStore();
    const [forceShow, setForceShow] = useState(false);
    const elements = useElementsByType("loot_table");
    const { itemsMap, isLoading: cacheLoading } = useFlattenedLootCache();

    const filtered = elements.filter((el) => {
        if (!matchesPath(el.identifier, filterPath)) return false;
        if (search && !el.identifier.resource.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const { visibleItems, hasMore, ref } = useInfiniteScroll(filtered, 24);
    const isBroadScope = filterPath === "" || !filterPath.includes("/");
    const isTooManyItems = !forceShow && isBroadScope && filtered.length > 50 && !search;

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="max-w-xl sticky top-0 px-8 py-4 bg-zinc-950/75 backdrop-blur-md border-b border-zinc-800/50">
                <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tables..." />
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-zinc-950/50">
                {isTooManyItems || visibleItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center pb-20 opacity-60">
                        <div className="size-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                            <img
                                src={isTooManyItems ? "/icons/tools/overview/grid.svg" : "/icons/search.svg"}
                                className="size-10 opacity-20 invert"
                                alt={isTooManyItems ? "Too many items" : "No results"}
                            />
                        </div>
                        <h3 className="text-xl font-medium text-zinc-300 mb-2">
                            <Translate content={isTooManyItems ? "loot:overview.too_many_items.title" : "loot:overview.empty.title"} />
                        </h3>
                        <p className="text-zinc-500 max-w-sm text-center mb-6">
                            <Translate content={isTooManyItems ? "loot:overview.too_many_items.description" : "loot:overview.empty.description"} />
                        </p>
                        {isTooManyItems && (
                            <button
                                type="button"
                                onClick={() => setForceShow(true)}
                                className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 text-zinc-400 rounded-lg text-sm transition-colors cursor-pointer">
                                <Translate content="loot:overview.too_many_items.button" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={cn("grid gap-4 pb-20", viewMode === "grid" ? "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]" : "grid-cols-1")}>
                        {visibleItems.map((element) => {
                            const id = new Identifier(element.identifier);
                            return (
                                <LootOverviewCard
                                    key={id.toUniqueKey()}
                                    elementId={id.toUniqueKey()}
                                    items={cacheLoading ? [] : (itemsMap.get(id.toString()) ?? [])}
                                    mode={viewMode}
                                />
                            );
                        })}
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

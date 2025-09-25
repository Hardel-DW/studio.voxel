import { createFileRoute } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { useState } from "react";
import LootOverviewCard from "@/components/tools/concept/loot/LootOverviewCard";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarSearch } from "@/components/tools/floatingbar/ToolbarSearch";
import Translate from "@/components/tools/Translate";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";

export const Route = createFileRoute("/$lang/studio/editor/loot_table/overview")({
    component: RouteComponent
});

function RouteComponent() {
    const [searchValue, setSearchValue] = useState("");
    const lootElements = useElementsByType("loot_table");
    const filteredElements = lootElements.filter(
        (el) => !searchValue || el.identifier.resource.toLowerCase().includes(searchValue.toLowerCase())
    );
    const { visibleItems, hasMore, ref } = useInfiniteScroll(filteredElements, 16);

    return (
        <div>
            <Toolbar>
                <ToolbarSearch placeholder="loot:overview.search.placeholder" value={searchValue} onChange={setSearchValue} />
            </Toolbar>

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold uppercase">
                        <Translate content="loot:overview.title" />
                    </h1>
                </div>
            </div>

            <hr className="my-4" />

            <div className="grid gap-4 overview-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {visibleItems.map((element) => {
                    const elementId = new Identifier(element.identifier).toUniqueKey();
                    return <LootOverviewCard key={element.identifier.resource} element={element} elementId={elementId} />;
                })}
            </div>

            {hasMore && (
                <div ref={ref} className="flex justify-center items-center mt-8 py-4">
                    <div className="bg-black/50 border-t-2 border-l-2 border-stone-900 rounded-xl p-2 opacity-60">
                        <span className="text-zinc-500 text-xs">
                            <Translate content="loot:overview.scroll.more" />
                        </span>
                    </div>
                </div>
            )}

            {filteredElements.length === 0 && (
                <div className="text-center py-12 text-zinc-400">
                    <div className="text-lg font-medium mb-2">
                        <Translate content="loot:overview.empty.title" />
                    </div>
                    <div className="text-sm">
                        <Translate content="loot:overview.empty.description" />
                    </div>
                </div>
            )}
        </div>
    );
}

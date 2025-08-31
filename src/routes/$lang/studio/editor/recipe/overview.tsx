import { createFileRoute } from "@tanstack/react-router";
import type { RecipeProps } from "@voxelio/breeze";
import { Identifier, isVoxel } from "@voxelio/breeze";
import { useState } from "react";
import RecipeOverviewCard from "@/components/tools/concept/recipe/RecipeOverviewCard";
import RecipeSelector from "@/components/tools/concept/recipe/RecipeSelector";
import { canBlockHandleRecipeType, getTypesFromSelection, RECIPE_BLOCKS } from "@/components/tools/concept/recipe/recipeConfig";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";

export const Route = createFileRoute("/$lang/studio/editor/recipe/overview")({
    component: Page
});

function Page() {
    const [search, setSearch] = useState("");
    const [selection, setSelection] = useState<string>("minecraft:barrier");
    const elements = useConfiguratorStore((state) => state.elements);
    const filteredElements = [...elements.values()]
        .filter((el) => isVoxel(el, "recipe"))
        .filter((el) => !search || el.identifier.resource.toLowerCase().includes(search.toLowerCase()))
        .filter((el) => getTypesFromSelection(selection).includes(el.type)) as RecipeProps[];
    const { visibleItems, hasMore, ref } = useInfiniteScroll(filteredElements, 16);
    const recipeCounts = new Map<string, number>(RECIPE_BLOCKS.map((block) => [block.id, 0]));

    for (const element of elements.values()) {
        if (!isVoxel(element, "recipe")) continue;
        for (const block of RECIPE_BLOCKS) {
            if (canBlockHandleRecipeType(block.id, element.type)) {
                recipeCounts.set(block.id, (recipeCounts.get(block.id) || 0) + 1);
            }
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold uppercase">Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    <input type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                    <div className="relative">
                        <RecipeSelector value={selection} onChange={setSelection} recipeCounts={recipeCounts} />
                    </div>
                </div>
            </div>

            <hr className="my-4" />
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                {visibleItems.map((element, index) => (
                    <RecipeOverviewCard
                        key={`${new Identifier(element.identifier).toUniqueKey()}-${index}`}
                        element={element}
                        elementId={new Identifier(element.identifier).toUniqueKey()}
                    />
                ))}
            </div>

            {/* Infinite scroll trigger */}
            {hasMore && (
                <div ref={ref} className="flex justify-center items-center mt-8 py-4">
                    <div className="bg-black/50 border-t-2 border-l-2 border-stone-900 rounded-xl p-2 opacity-60">
                        <span className="text-zinc-500 text-xs">Scroll for more</span>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {filteredElements.length === 0 && (
                <div className="text-center py-12 text-zinc-400">
                    <div className="text-lg font-medium mb-2">No recipes found</div>
                    <div className="text-sm">Try adjusting your search or filter</div>
                </div>
            )}
        </div>
    );
}

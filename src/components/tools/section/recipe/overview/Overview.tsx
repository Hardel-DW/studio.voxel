import { Identifier, isVoxel } from "@voxelio/breeze";
import type { Analysers, RecipeProps } from "@voxelio/breeze";
import { useState } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import RecipeOverviewCard from "./RecipeOverviewCard";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";
import { RecipeBlockManager, RECIPE_BLOCKS } from "../recipeConfig";
import dynamic from "next/dynamic";
import Loader from "@/components/ui/Loader";

const RecipeSelector = dynamic(() => import("@/components/tools/elements/recipe/RecipeSelector"), {
    loading: () => <Loader />,
    ssr: false
});

export default function Overview() {
    const [search, setSearch] = useState("");
    const [selection, setSelection] = useState<string>("minecraft:barrier");
    const [selectedTypes, setSelectedTypes] = useState<string[]>(RecipeBlockManager.getAllRecipeTypes());
    const elements = useConfiguratorStore((state) => state.elements);
    const filteredElements = getFilteredElements(elements, search, selectedTypes);
    const { visibleItems, hasMore, ref } = useInfiniteScroll(filteredElements, 16);
    const recipeCounts = getRecipeCounts(elements);

    return (
        <div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold uppercase">Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    <input type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                    <div className="relative">
                        <RecipeSelector
                            selection={selection}
                            setSelection={setSelection}
                            onTypesChange={(types) => setSelectedTypes(types)}
                            recipeCounts={recipeCounts}
                        />
                    </div>
                </div>
            </div>

            <hr className="my-4" />
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                {visibleItems.map((element, index) => (
                    <RecipeOverviewCard
                        key={new Identifier(element.identifier).toUniqueKey() + `-${index}`}
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

function getFilteredElements(elements: Map<string, Analysers[keyof Analysers]["voxel"]>, search: string, selectedTypes: string[]): RecipeProps[] {
    const filtered: RecipeProps[] = [];

    for (const element of elements.values()) {
        if (!isVoxel(element, "recipe")) continue;
        if (search && !element.identifier.resource.toLowerCase().includes(search.toLowerCase())) continue;

        if (selectedTypes.includes(element.type)) {
            filtered.push(element);
        }
    }

    return filtered;
}

function getRecipeCounts(elements: Map<string, Analysers[keyof Analysers]["voxel"]>): Map<string, number> {
    const counts = new Map<string, number>();

    // Initialiser tous les compteurs pour les blocs
    RECIPE_BLOCKS.forEach(block => {
        counts.set(block.id, 0);
    });

    // Compter pour chaque élément
    for (const element of elements.values()) {
        if (!isVoxel(element, "recipe")) continue;

        // Compter pour les blocs
        for (const block of RECIPE_BLOCKS) {
            if (RecipeBlockManager.canBlockHandleRecipeType(block.id, element.type)) {
                counts.set(block.id, (counts.get(block.id) || 0) + 1);
            }
        }

        // Compter pour les types spécifiques
        const recipeType = element.type;
        counts.set(recipeType, (counts.get(recipeType) || 0) + 1);
    }

    return counts;
}

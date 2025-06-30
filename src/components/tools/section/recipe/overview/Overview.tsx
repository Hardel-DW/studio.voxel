import { Identifier, isVoxel } from "@voxelio/breeze";
import type { Analysers } from "@voxelio/breeze";
import { useState } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import RecipeOverviewCard from "./RecipeOverviewCard";
import CraftHeaderBar from "@/components/tools/elements/recipe/CraftHeaderBar";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";

type RecipeProps = Analysers["recipe"]["voxel"];

type RecipeConfig = {
    id: string;
    name: string;
    recipe_type?: string[];
}

export const RECIPES = [
    { id: "minecraft:barrier", name: "Aucun Filtre" },
    { id: "minecraft:campfire", name: "Campfire", recipe_type: ["minecraft:campfire_cooking"] },
    { id: "minecraft:furnace", name: "Furnace", recipe_type: ["minecraft:smelting"] },
    { id: "minecraft:blast_furnace", name: "Blast Furnace", recipe_type: ["minecraft:blasting"] },
    { id: "minecraft:smoker", name: "Smoker", recipe_type: ["minecraft:smoking"] },
    { id: "minecraft:stonecutter", name: "Stonecutter", recipe_type: ["minecraft:stonecutting"] },
    { id: "minecraft:crafting_table", name: "Crafting Table" },
    { id: "minecraft:smithing_table", name: "Smithing Table", recipe_type: ["minecraft:smithing_transform", "minecraft:smithing_trim"] },
    { id: "minecraft:loom", name: "Loom", recipe_type: ["minecraft:banner_duplicate"] }
] as RecipeConfig[];

export default function Overview() {
    const [search, setSearch] = useState("");
    const [recipeType, setRecipeType] = useState<string>(RECIPES[0].id);
    const elements = useConfiguratorStore((state) => state.elements);
    const filteredElements = getFilteredElements(elements, search, recipeType);
    const recipeCounts = getRecipeCounts(elements);
    const { visibleItems, hasMore, ref } = useInfiniteScroll(filteredElements, 16);

    return (
        <div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold uppercase">Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    <input type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                    <div className="relative">
                        <CraftHeaderBar recipeType={recipeType} setRecipeType={setRecipeType} recipeCounts={recipeCounts} />
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

/**
 * Filtre les éléments par recherche
 */
function getFilteredElements(elements: Map<string, Analysers[keyof Analysers]["voxel"]>, search: string, recipeType: string): RecipeProps[] {
    const filtered: RecipeProps[] = [];
    for (const element of elements.values()) {
        if (!isVoxel(element, "recipe")) {
            continue;
        }

        if (search && !element.identifier.resource.toLowerCase().includes(search.toLowerCase())) {
            continue;
        }

        // Aucun filtre - afficher tout
        if (recipeType === "minecraft:barrier") {
            filtered.push(element);
            continue;
        }

        // Crafting table - tous les types crafting_
        if (recipeType === "minecraft:crafting_table") {
            if (element.type.includes("crafting_")) {
                filtered.push(element);
            }
            continue;
        }

        // Autres - utiliser recipe_type du tableau RECIPES
        const recipeConfig = RECIPES.find(r => r.id === recipeType);
        if (recipeConfig?.recipe_type) {
            if (recipeConfig.recipe_type.some(type => element.type === type)) {
                filtered.push(element);
            }
            continue;
        }

        filtered.push(element);
    }

    return filtered;
}

function getRecipeCounts(elements: Map<string, Analysers[keyof Analysers]["voxel"]>): { [key: string]: number } {
    const counts: { [key: string]: number } = {};

    // Initialiser tous les compteurs
    RECIPES.forEach(recipe => {
        counts[recipe.id] = 0;
    });

    // Compter pour chaque élément
    for (const element of elements.values()) {
        if (!isVoxel(element, "recipe")) {
            continue;
        }

        // Compter pour barrier (tous)
        counts["minecraft:barrier"]++;

        // Compter pour crafting_table
        if (element.type.includes("crafting_")) {
            counts["minecraft:crafting_table"]++;
        }

        // Compter pour les autres selon leur recipe_type
        RECIPES.forEach(recipe => {
            if (recipe.recipe_type) {
                if (recipe.recipe_type.some(type => element.type === type)) {
                    counts[recipe.id]++;
                }
            }
        });
    }

    return counts;
}

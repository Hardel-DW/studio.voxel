import { Identifier, isVoxel } from "@voxelio/breeze";
import type { Analysers } from "@voxelio/breeze";
import { useState } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import RecipeOverviewCard from "./RecipeOverviewCard";
import CraftHeaderBar from "@/components/tools/elements/recipe/CraftHeaderBar";

type RecipeProps = Analysers["recipe"]["voxel"];

export const RECIPES = [
    { id: "minecraft:campfire", name: "Campfire" },
    { id: "minecraft:furnace", name: "Furnace" },
    { id: "minecraft:blast_furnace", name: "Blast Furnace" },
    { id: "minecraft:smoker", name: "Smoker" },
    { id: "minecraft:stonecutter", name: "Stonecutter" },
    { id: "minecraft:crafting_table", name: "Crafting Table" },
    { id: "minecraft:smithing_table", name: "Smithing Table" },
    { id: "minecraft:loom", name: "Loom" },
    { id: "minecraft:barrier", name: "Aucun Filtre" }
] as const;


export default function Overview() {
    const [search, setSearch] = useState("");
    const elements = useConfiguratorStore((state) => state.elements);
    const filteredElements = getFilteredElements(elements, search);
    const [recipeType, setRecipeType] = useState<string>(RECIPES[0].id);
    return (
        <div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold uppercase">Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    <input type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                    <div className="relative">
                        <CraftHeaderBar recipeType={recipeType} setRecipeType={setRecipeType} />
                    </div>
                </div>
            </div>

            <hr className="my-4" />

            {/* Grille unique pour toutes les cartes */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {filteredElements.map((element, index) => {
                    return (
                        <RecipeOverviewCard
                            key={new Identifier(element.identifier).toUniqueKey() + `-${index}`}
                            element={element}
                            elementId={new Identifier(element.identifier).toUniqueKey() + `-${index}`}
                        />
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Filtre les éléments par recherche
 */
function getFilteredElements(elements: Map<string, Analysers[keyof Analysers]["voxel"]>, search: string): RecipeProps[] {
    const filtered: RecipeProps[] = [];
    for (const element of elements.values()) {
        if (!isVoxel(element, "recipe")) {
            continue;
        }

        if (search && !element.identifier.resource.toLowerCase().includes(search.toLowerCase())) {
            continue;
        }

        filtered.push(element);
    }

    return filtered;
}

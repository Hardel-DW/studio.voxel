import { Identifier, isVoxel } from "@voxelio/breeze";
import type { Analysers } from "@voxelio/breeze";
import { useState } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import RecipeOverviewCard from "./RecipeOverviewCard";

type RecipeProps = Analysers["recipe"]["voxel"];

export default function Overview() {
    const [search, setSearch] = useState("");
    const elements = useConfiguratorStore((state) => state.elements);
    const filteredElements = getFilteredElements(elements, search);

    return (
        <div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold uppercase">Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    <input type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <hr className="my-4" />

            {/* Grille unique pour toutes les cartes */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {filteredElements.map((element) => {
                    return (
                        <RecipeOverviewCard
                            key={element.identifier.resource}
                            element={element}
                            elementId={new Identifier(element.identifier).toUniqueKey()}
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

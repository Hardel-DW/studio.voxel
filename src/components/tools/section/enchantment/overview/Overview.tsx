import { Identifier } from "@voxelio/breeze";
import { useConfiguratorStore } from "../../../Store";
import type { Analysers } from "@voxelio/breeze";
import { useState } from "react";
import useTagManager from "@/lib/hook/useTagManager";
import OverviewCard from "./OverviewCard";
import SquareButton from "@/components/tools/elements/SquareButton";

type EnchantmentProps = Analysers["enchantment"]["voxel"];
const UNCATEGORIZED_KEY = "#minecraft:undefined";

export default function Overview() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"exclusiveSet" | "supportedItems">("supportedItems");
    const [display, setDisplay] = useState<"minimal" | "detailed">("detailed");
    const elements = useConfiguratorStore((state) => state.elements);
    const elementsBySet = groupElementsByExclusiveSet(elements, filter, search);
    const { getAllItemsFromTag } = useTagManager();

    return (
        <div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold uppercase">Overview</h1>
                </div>
                <div className="flex gap-2">
                    <input type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                    <SquareButton
                        icon={`/icons/tools/overview/${display === "minimal" ? "list" : "map"}.svg`}
                        onClick={() => setDisplay(display === "minimal" ? "detailed" : "minimal")}
                        size="md"
                    />
                </div>
            </div>

            <hr className="my-4" />

            {/* Render elements by category */}
            <div className="flex flex-col gap-4">
                {Array.from(elementsBySet.entries()).map(
                    ([category, categoryElements]) =>
                        categoryElements.length > 0 && (
                            <div key={category} className="mb-8">
                                <h2 className="text-xl font-bold mb-4">{Identifier.of(category, "tags/enchantments").toResourceName()}</h2>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {categoryElements.map((element) => {
                                        const { isTag, id } = getItemFromMultipleOrOne(element.supportedItems);

                                        return (
                                            <OverviewCard
                                                key={new Identifier(element.identifier).toUniqueKey()}
                                                element={element}
                                                items={isTag ? getAllItemsFromTag(id) : [id]}
                                                elementId={new Identifier(element.identifier).toUniqueKey()}
                                                display={display}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )
                )}
            </div>
        </div>
    );
}

function getItemFromMultipleOrOne(element: string | string[]): { isTag: boolean; id: string } {
    const getItem = (id: string) => {
        if (id.startsWith("#")) {
            return { isTag: true, id };
        }

        return { isTag: false, id };
    };

    if (typeof element === "string") return getItem(element);
    return getItem(element[0]);
}

/**
 * Groups elements by their exclusiveSet property
 * String[] and undefined exclusiveSets are grouped under UNCATEGORIZED_KEY
 */
function groupElementsByExclusiveSet(
    elements: Map<string, EnchantmentProps>,
    key: string,
    search: string
): Map<string, EnchantmentProps[]> {
    const groups = new Map<string, EnchantmentProps[]>();
    groups.set(UNCATEGORIZED_KEY, []);

    for (const element of elements.values()) {
        const category = typeof element[key] === "string" ? element[key] : UNCATEGORIZED_KEY;

        if (search && !element.identifier.resource.toLowerCase().includes(search.toLowerCase())) {
            continue;
        }

        const categoryElements = groups.get(category) || [];
        categoryElements.push(element);
        groups.set(category, categoryElements);
    }

    return groups;
}

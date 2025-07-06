import SquareButton from "@/components/tools/elements/SquareButton";
import useTagManager from "@/lib/hook/useTagManager";
import { Identifier, isVoxel } from "@voxelio/breeze";
import type { Analysers } from "@voxelio/breeze";
import { useState } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import EnchantOverviewCard from "./EnchantOverviewCard";

type EnchantmentProps = Analysers["enchantment"]["voxel"];
const UNCATEGORIZED_KEY = "#minecraft:undefined";

export default function Overview() {
    const [search, setSearch] = useState("");
    const [display, setDisplay] = useState<"minimal" | "detailed">("minimal");
    const elements = useConfiguratorStore((state) => state.elements);
    const { getAllItemsFromTag } = useTagManager();
    const filteredElements = [...elements.values()]
        .filter(el => isVoxel(el, "enchantment"))
        .filter(el => !search || el.identifier.resource.toLowerCase().includes(search.toLowerCase())) as EnchantmentProps[];

    return (
        <div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold uppercase">Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    <input type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />

                    <SquareButton
                        icon={`/icons/tools/overview/${display === "minimal" ? "list" : "map"}.svg`}
                        onClick={() => setDisplay(display === "minimal" ? "detailed" : "minimal")}
                        size="md"
                    />
                </div>
            </div>

            <hr className="my-4" />

            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {filteredElements.map((element) => {
                    const { isTag, id } = getItemFromMultipleOrOne(element.supportedItems);

                    return (
                        <EnchantOverviewCard
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
    elements: Map<string, Analysers[keyof Analysers]["voxel"]>,
    key: string,
    search: string
): Map<string, EnchantmentProps[]> {
    const groups = new Map<string, EnchantmentProps[]>();
    groups.set(UNCATEGORIZED_KEY, []);

    for (const element of elements.values()) {
        if (!isVoxel(element, "enchantment")) {
            continue;
        }

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
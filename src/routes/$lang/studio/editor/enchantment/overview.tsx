import { createFileRoute } from "@tanstack/react-router";
import type { Analysers } from "@voxelio/breeze";
import { Identifier, isVoxel } from "@voxelio/breeze";
import { useState } from "react";
import EnchantOverviewCard from "@/components/tools/concept/enchantment/EnchantOverviewCard";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useFloatingBarStore } from "@/components/ui/FloatingBar/FloatingBarStore";
import { useFloatingBar } from "@/components/ui/FloatingBar/useFloatingBar";
import useTagManager from "@/lib/hook/useTagManager";

type EnchantmentProps = Analysers["enchantment"]["voxel"];

export const Route = createFileRoute("/$lang/studio/editor/enchantment/overview")({
    component: Page
});

function Page() {
    const [display, setDisplay] = useState<"minimal" | "detailed">("minimal");
    const elements = useConfiguratorStore((state) => state.elements);
    const { getAllItemsFromTag } = useTagManager();
    const { init } = useFloatingBar();
    const searchValue = useFloatingBarStore((state) => state.searchValue);

    const filteredElements = [...elements.values()]
        .filter((el) => isVoxel(el, "enchantment"))
        .filter((el) => !searchValue || el.identifier.resource.toLowerCase().includes(searchValue.toLowerCase())) as EnchantmentProps[];

    init({
        searchConfig: {
            placeholder: "Search enchantments...",
            onChange: () => {}
        },
        buttons: [
            {
                id: "display-toggle",
                icon: `/icons/tools/overview/${display === "minimal" ? "list" : "map"}.svg`,
                tooltip: display === "minimal" ? "Detailed view" : "Minimal view",
                onClick: () => setDisplay(display === "minimal" ? "detailed" : "minimal")
            }
        ]
    });

    return (
        <div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold uppercase">Overview</h1>
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

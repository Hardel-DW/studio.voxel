import { createFileRoute } from "@tanstack/react-router";
import { Identifier, isVoxel } from "@voxelio/breeze/core";
import type { LootTableProps } from "@voxelio/breeze/schema";
import { useState } from "react";
import LootOverviewCard from "@/components/tools/concept/loot/LootOverviewCard";
import { useConfiguratorStore } from "@/components/tools/Store";

export const Route = createFileRoute("/$lang/studio/editor/loot/overview")({
    component: RouteComponent
});

function RouteComponent() {
    const [search, setSearch] = useState("");
    const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
    const elements = useConfiguratorStore((state) => state.elements);
    const filteredElements = [...elements.values()]
        .filter((el) => isVoxel(el, "loot_table"))
        .filter((el) => !search || el.identifier.resource.toLowerCase().includes(search.toLowerCase())) as LootTableProps[];

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

            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {filteredElements.map((element) => {
                    const elementId = new Identifier(element.identifier).toUniqueKey();
                    const isBlurred = openPopoverId !== null && openPopoverId !== elementId;
                    return (
                        <LootOverviewCard
                            key={element.identifier.resource}
                            element={element}
                            elementId={elementId}
                            isBlurred={isBlurred}
                            onPopoverChange={(isOpen) => setOpenPopoverId(isOpen ? elementId : null)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

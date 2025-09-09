import { createFileRoute } from "@tanstack/react-router";
import type { LootTableProps } from "@voxelio/breeze";
import { Identifier, isVoxel } from "@voxelio/breeze";
import { useState } from "react";
import LootOverviewCard from "@/components/tools/concept/loot/LootOverviewCard";
import { useConfiguratorStore } from "@/components/tools/Store";
import { Toolbar } from "@/components/ui/FloatingBar/Toolbar";
import { ToolbarSearch } from "@/components/ui/FloatingBar/ToolbarSearch";

export const Route = createFileRoute("/$lang/studio/editor/loot/overview")({
    component: RouteComponent
});

function RouteComponent() {
    const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const elements = useConfiguratorStore((state) => state.elements);

    const filteredElements = [...elements.values()]
        .filter((el) => isVoxel(el, "loot_table"))
        .filter((el) => !searchValue || el.identifier.resource.toLowerCase().includes(searchValue.toLowerCase())) as LootTableProps[];

    return (
        <div>
            <Toolbar>
                <ToolbarSearch placeholder="Search loot tables..." value={searchValue} onChange={setSearchValue} />
            </Toolbar>

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold uppercase">Overview</h1>
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

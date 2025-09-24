import { createFileRoute } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { useState } from "react";
import LootOverviewCard from "@/components/tools/concept/loot/LootOverviewCard";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarSearch } from "@/components/tools/floatingbar/ToolbarSearch";
import Translate from "@/components/tools/Translate";
import { useElementsByType } from "@/lib/hook/useElementsByType";

export const Route = createFileRoute("/$lang/studio/editor/loot_table/overview")({
    component: RouteComponent
});

function RouteComponent() {
    const [searchValue, setSearchValue] = useState("");
    const lootElements = useElementsByType("loot_table");
    const filteredElements = lootElements.filter(
        (el) => !searchValue || el.identifier.resource.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <div>
            <Toolbar>
                <ToolbarSearch placeholder="loot:overview.search.placeholder" value={searchValue} onChange={setSearchValue} />
            </Toolbar>

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold uppercase">
                        <Translate content="loot:overview.title" />
                    </h1>
                </div>
            </div>

            <hr className="my-4" />

            <div className="grid gap-4 loot-overview-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {filteredElements.map((element) => {
                    const elementId = new Identifier(element.identifier).toUniqueKey();
                    return <LootOverviewCard key={element.identifier.resource} element={element} elementId={elementId} />;
                })}
            </div>
        </div>
    );
}

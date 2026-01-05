import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import { useConfiguratorStore } from "@/components/tools/Store";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { TreeProvider } from "@/components/ui/tree/TreeNavigationContext";
import { TreeSidebar } from "@/components/ui/tree/TreeSidebar";
import { CONCEPTS } from "@/lib/data/elements";
import { buildLootTableTree } from "@/components/tools/concept/loot/buildLootTableTree";
import { useElementsIdByType } from "@/lib/hook/useElementsByType";

const concept = CONCEPTS.find((c) => c.registry === "loot_table");
if (!concept) throw new Error("Loot table concept not found");
const overviewRoute = concept.overview;
const detailRoute = concept.tabs[0].url;
const tabRoutes = concept.tabs.map((t) => t.url);
const changesRoute = "/$lang/studio/editor/changes/main";
export const Route = createFileRoute("/$lang/studio/editor/loot_table")({
    component: LootTableLayout,
    notFoundComponent: NotFoundStudio
});

function LootTableLayout() {
    const { lang } = Route.useParams();
    const { filterPath, viewMode, setViewMode } = useEditorUiStore();
    const { setContainerRef } = useDynamicIsland();
    const isOverview = useLocation({ select: (loc) => loc.pathname.endsWith("/overview") });
    const navigate = useNavigate();
    const elementIds = useElementsIdByType("loot_table");
    const tree = buildLootTableTree(elementIds);
    const currentElement = useConfiguratorStore((s) => s.currentElementId);
    const identifier = currentElement ? Identifier.fromUniqueKey(currentElement) : undefined;
    const concept = "loot_table";

    return (
        <TreeProvider config={{ concept, overviewRoute, detailRoute, changesRoute, tabRoutes, tree }}>
            <div className="flex size-full overflow-hidden relative isolate">
                <EditorSidebar
                    title="loot:overview.title"
                    icon="/images/features/item/bundle_close.webp"
                    linkTo="/$lang/studio/editor/loot_table/overview">
                    <TreeSidebar />
                </EditorSidebar>

                <main ref={setContainerRef} className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative bg-zinc-950">
                    <EditorHeader
                        fallbackTitle="Loot Table"
                        identifier={
                            identifier
                                ? { namespace: identifier.namespace, registry: identifier.registry, resource: identifier.resource }
                                : undefined
                        }
                        filterPath={filterPath}
                        isOverview={isOverview}
                        onBack={() => navigate({ to: "/$lang/studio/editor/loot_table/overview", params: { lang } })}>
                        <ToggleGroup value={viewMode} onChange={setViewMode}>
                            <ToggleGroupOption
                                value="grid"
                                icon={<img src="/icons/tools/overview/grid.svg" className="size-4 invert" alt="Grid view" />}
                            />
                            <ToggleGroupOption
                                value="list"
                                icon={<img src="/icons/tools/overview/list.svg" className="size-4 invert" alt="List view" />}
                            />
                        </ToggleGroup>
                    </EditorHeader>
                    <Outlet />
                </main>
            </div>
        </TreeProvider>
    );
}

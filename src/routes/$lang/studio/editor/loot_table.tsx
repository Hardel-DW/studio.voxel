import { createFileRoute, Outlet, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { isVoxel } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import { getCurrentElement, getModifiedElements, useConfiguratorStore } from "@/components/tools/Store";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { TreeNavigationProvider } from "@/components/ui/TreeNavigationContext";
import { TreeSidebar } from "@/components/ui/TreeSidebar";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { buildTree } from "@/lib/utils/tree";

export const Route = createFileRoute("/$lang/studio/editor/loot_table")({
    component: LootTableLayout,
    notFoundComponent: NotFoundStudio
});

const TREE_CONFIG = {
    overviewRoute: "/$lang/studio/editor/loot_table/overview",
    detailRoute: "/$lang/studio/editor/loot_table/main"
};

function LootTableLayout() {
    const { lang } = useParams({ from: "/$lang/studio/editor/loot_table" });
    const { filterPath, viewMode, setViewMode } = useEditorUiStore();
    const location = useLocation();
    const navigate = useNavigate();
    const elements = useElementsByType("loot_table");
    const tree = buildTree(
        elements.map((e) => e.identifier),
        true
    );
    const modifiedCount = useConfiguratorStore((s) => getModifiedElements(s, "loot_table").length);
    const currentElement = useConfiguratorStore((s) => getCurrentElement(s));
    const lootTable = currentElement && isVoxel(currentElement, "loot_table") ? currentElement : undefined;
    const isOverview = location.pathname.endsWith("/overview");

    return (
        <TreeNavigationProvider config={TREE_CONFIG}>
            <div className="flex size-full overflow-hidden relative isolate">
                <EditorSidebar
                    title="loot:overview.title"
                    icon="/images/features/item/bundle_close.webp"
                    linkTo="/$lang/studio/editor/loot_table/overview">
                    <TreeSidebar tree={tree} modifiedCount={modifiedCount} changesRoute="/$lang/studio/editor/loot_table/changes" />
                </EditorSidebar>

                <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative bg-zinc-950">
                    <EditorHeader
                        fallbackTitle="Loot Table"
                        identifier={lootTable?.identifier}
                        filterPath={filterPath}
                        isOverview={isOverview}
                        onBack={() => navigate({ to: "/$lang/studio/editor/loot_table/overview", params: { lang } })}>
                        <ToggleGroup value={viewMode} onChange={setViewMode}>
                            <ToggleGroupOption
                                value="grid"
                                icon={<img src="/icons/tools/overview/grid.svg" className="size-4 invert" alt="" />}
                            />
                            <ToggleGroupOption
                                value="list"
                                icon={<img src="/icons/tools/overview/list.svg" className="size-4 invert" alt="" />}
                            />
                        </ToggleGroup>
                    </EditorHeader>
                    <Outlet />
                </main>
            </div>
        </TreeNavigationProvider>
    );
}

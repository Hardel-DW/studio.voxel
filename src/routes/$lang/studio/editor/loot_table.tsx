import { createFileRoute, Outlet, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { isVoxel } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { FileTree } from "@/components/ui/FileTree";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { buildTree } from "@/lib/utils/tree";

export const Route = createFileRoute("/$lang/studio/editor/loot_table")({
    component: LootTableLayout
});

function LootTableLayout() {
    const { lang } = useParams({ from: "/$lang/studio/editor/loot_table" });
    const { filterPath, setFilterPath, viewMode, setViewMode } = useEditorUiStore();
    const elements = useElementsByType("loot_table");
    const tree = buildTree(elements.map((e) => e.identifier));
    const location = useLocation();
    const navigate = useNavigate();
    const isOverview = location.pathname.endsWith("/overview");
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const lootTable = currentElement && isVoxel(currentElement, "loot_table") ? currentElement : undefined;

    const handleBack = () => navigate({ to: "/$lang/studio/editor/loot_table/overview", params: { lang } });
    const handleTreeSelect = (path: string) => {
        setFilterPath(path);
        if (!isOverview) {
            navigate({ to: "/$lang/studio/editor/loot_table/overview", params: { lang } });
        }
    };

    return (
        <div className="flex size-full overflow-hidden relative isolate">
            <EditorSidebar
                title="loot:overview.title"
                icon="/images/features/item/bundle_close.webp"
                linkTo="/$lang/studio/editor/loot_table/overview">
                <FileTree tree={tree} activePath={filterPath} onSelect={handleTreeSelect} />
            </EditorSidebar>

            <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative bg-zinc-950">
                <EditorHeader
                    fallbackTitle="Loot Table"
                    identifier={lootTable?.identifier}
                    filterPath={filterPath}
                    isOverview={isOverview}
                    onBack={handleBack}>
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
    );
}

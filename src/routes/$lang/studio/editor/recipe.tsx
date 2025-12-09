import { createFileRoute, Outlet, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { isVoxel } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { buildRecipeTree } from "@/components/tools/concept/recipe/buildRecipeTree";
import { RECIPE_BLOCKS } from "@/components/tools/concept/recipe/recipeConfig";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { FileTree } from "@/components/ui/FileTree";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { Identifier } from "@voxelio/breeze";

export const Route = createFileRoute("/$lang/studio/editor/recipe")({
    component: RecipeLayout
});

const RECIPE_FOLDER_ICONS: Record<string, string> = Object.fromEntries(
    RECIPE_BLOCKS.filter((b) => !b.isSpecial).flatMap((b) => {
        const icon = `/images/features/block/${Identifier.of(b.id, "none").resource}.webp`;
        return [[b.id, icon], ...b.recipeTypes.map((t) => [t, icon])];
    })
);

function RecipeLayout() {
    const { lang } = useParams({ from: "/$lang/studio/editor/recipe" });
    const { filterPath, setFilterPath, viewMode, setViewMode } = useEditorUiStore();
    const elements = useElementsByType("recipe");
    const tree = buildRecipeTree(elements);
    const location = useLocation();
    const navigate = useNavigate();
    const isOverview = location.pathname.endsWith("/overview");
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const recipe = currentElement && isVoxel(currentElement, "recipe") ? currentElement : undefined;

    const handleBack = () => navigate({ to: "/$lang/studio/editor/recipe/overview", params: { lang } });
    const handleTreeSelect = (path: string) => {
        setFilterPath(path);
        if (!isOverview) {
            navigate({ to: "/$lang/studio/editor/recipe/overview", params: { lang } });
        }
    };

    return (
        <div className="flex size-full overflow-hidden relative z-10 isolate">
            <EditorSidebar
                title="recipe:overview.title"
                icon="/images/features/block/crafting_table.webp"
                linkTo="/$lang/studio/editor/recipe/overview">
                <FileTree tree={tree} activePath={filterPath} onSelect={handleTreeSelect} folderIcons={RECIPE_FOLDER_ICONS} />
            </EditorSidebar>

            <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative bg-zinc-950">
                <EditorHeader fallbackTitle="Recipe" identifier={recipe?.identifier} filterPath={filterPath} isOverview={isOverview} onBack={handleBack}>
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

import { createFileRoute, Outlet, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { Identifier, isVoxel } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import SidebarButton from "@/components/tools/concept/layout/EditorButton";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { buildRecipeTree } from "@/components/tools/concept/recipe/buildRecipeTree";
import { RECIPE_BLOCKS } from "@/components/tools/concept/recipe/recipeConfig";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import { getCurrentElement, getModifiedElements, useConfiguratorStore } from "@/components/tools/Store";
import { FileTree } from "@/components/ui/FileTree";
import { useElementsByType } from "@/lib/hook/useElementsByType";

export const Route = createFileRoute("/$lang/studio/editor/recipe")({
    component: RecipeLayout,
    notFoundComponent: NotFoundStudio
});

const RECIPE_FOLDER_ICONS: Record<string, string> = Object.fromEntries(
    RECIPE_BLOCKS.filter((b) => !b.isSpecial).flatMap((b) => {
        const icon = `/images/features/block/${Identifier.of(b.id, "none").resource}.webp`;
        return [[b.id, icon], ...b.recipeTypes.map((t) => [t, icon])];
    })
);

const RECIPE_ICON = "/images/features/block/crafting_table.webp";

function RecipeLayout() {
    const { lang } = useParams({ from: "/$lang/studio/editor/recipe" });
    const { filterPath, setFilterPath } = useEditorUiStore();
    const elements = useElementsByType("recipe");
    const modifiedCount = useConfiguratorStore((state) => getModifiedElements(state, "recipe").length);
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
            <EditorSidebar title="recipe:overview.title" icon={RECIPE_ICON} linkTo="/$lang/studio/editor/recipe/overview">
                <div className="space-y-1 mt-4">
                    <SidebarButton
                        icon="/icons/pencil.svg"
                        count={modifiedCount}
                        disabled={modifiedCount === 0}
                        to="/$lang/studio/editor/recipe/changes"
                        params={{ lang }}>
                        Updated
                    </SidebarButton>
                    <SidebarButton
                        icon="/icons/search.svg"
                        count={tree.count}
                        isActive={filterPath === ""}
                        onClick={() => setFilterPath("")}>
                        All
                    </SidebarButton>
                    <FileTree tree={tree} activePath={filterPath} onSelect={handleTreeSelect} folderIcons={RECIPE_FOLDER_ICONS} />
                </div>
            </EditorSidebar>

            <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative bg-zinc-950">
                <EditorHeader
                    fallbackTitle="Recipe"
                    identifier={recipe?.identifier}
                    filterPath={filterPath}
                    isOverview={isOverview}
                    onBack={handleBack}
                />
                <Outlet />
            </main>
        </div>
    );
}

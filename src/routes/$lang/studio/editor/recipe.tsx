import { createFileRoute, Outlet, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { Identifier, isVoxel } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { buildRecipeTree } from "@/components/tools/concept/recipe/buildRecipeTree";
import { RECIPE_BLOCKS } from "@/components/tools/concept/recipe/recipeConfig";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import { getCurrentElement, getModifiedElements, useConfiguratorStore } from "@/components/tools/Store";
import { TreeNavigationProvider } from "@/components/ui/TreeNavigationContext";
import { TreeSidebar } from "@/components/ui/TreeSidebar";
import { useElementsByType } from "@/lib/hook/useElementsByType";

const RECIPE_ICON = "/images/features/block/crafting_table.webp";
const RECIPE_FOLDER_ICONS: Record<string, string> = Object.fromEntries(
    RECIPE_BLOCKS.filter((b) => !b.isSpecial).flatMap((b) => {
        const icon = `/images/features/block/${Identifier.of(b.id, "none").resource}.webp`;
        return [[b.id, icon], ...b.recipeTypes.map((t) => [t, icon])];
    })
);

const TREE_CONFIG = {
    overviewRoute: "/$lang/studio/editor/recipe/overview",
    detailRoute: "/$lang/studio/editor/recipe/main"
};

export const Route = createFileRoute("/$lang/studio/editor/recipe")({
    component: RecipeLayout,
    notFoundComponent: NotFoundStudio
});

function RecipeLayout() {
    const { lang } = useParams({ from: "/$lang/studio/editor/recipe" });
    const { filterPath } = useEditorUiStore();
    const location = useLocation();
    const navigate = useNavigate();
    const elements = useElementsByType("recipe");
    const tree = buildRecipeTree(elements);
    const modifiedCount = useConfiguratorStore((s) => getModifiedElements(s, "recipe").length);
    const currentElement = useConfiguratorStore((s) => getCurrentElement(s));
    const recipe = currentElement && isVoxel(currentElement, "recipe") ? currentElement : undefined;
    const isOverview = location.pathname.endsWith("/overview");

    return (
        <TreeNavigationProvider config={TREE_CONFIG}>
            <div className="flex size-full overflow-hidden relative z-10 isolate">
                <EditorSidebar title="recipe:overview.title" icon={RECIPE_ICON} linkTo="/$lang/studio/editor/recipe/overview">
                    <TreeSidebar
                        tree={tree}
                        modifiedCount={modifiedCount}
                        changesRoute="/$lang/studio/editor/recipe/changes"
                        folderIcons={RECIPE_FOLDER_ICONS}
                    />
                </EditorSidebar>

                <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative bg-zinc-950">
                    <EditorHeader
                        fallbackTitle="Recipe"
                        identifier={recipe?.identifier}
                        filterPath={filterPath}
                        isOverview={isOverview}
                        onBack={() => navigate({ to: "/$lang/studio/editor/recipe/overview", params: { lang } })}
                    />
                    <Outlet />
                </main>
            </div>
        </TreeNavigationProvider>
    );
}

import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { buildRecipeTree } from "@/components/tools/concept/recipe/buildRecipeTree";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import { getModifiedElements, useConfiguratorStore } from "@/components/tools/Store";
import { TreeProvider } from "@/components/ui/tree/TreeNavigationContext";
import { TreeSidebar } from "@/components/ui/tree/TreeSidebar";
import { CONCEPTS } from "@/lib/data/elements";
import { RECIPE_BLOCKS } from "@/lib/data/recipeConfig";
import { useElementsByType } from "@/lib/hook/useElementsByType";

const concept = CONCEPTS.find((c) => c.registry === "recipe");
if (!concept) throw new Error("Recipe concept not found");
const overviewRoute = concept.overview;
const detailRoute = concept.tabs[0].url;
const tabRoutes = concept.tabs.map((t) => t.url);
const changesRoute = "/$lang/studio/editor/recipe/changes";
const RECIPE_ICON = "/images/features/block/crafting_table.webp";
const folderIcons: Record<string, string> = Object.fromEntries(
    RECIPE_BLOCKS.filter((b) => !b.isSpecial).flatMap((b) => {
        const icon = `/images/features/block/${Identifier.of(b.id, "none").resource}.webp`;
        return [[b.id, icon], ...b.recipeTypes.map((t) => [t, icon])];
    })
);

export const Route = createFileRoute("/$lang/studio/editor/recipe")({
    component: RecipeLayout,
    notFoundComponent: NotFoundStudio
});

function RecipeLayout() {
    const { filterPath } = useEditorUiStore();
    const { lang } = Route.useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const elements = useElementsByType("recipe");
    const tree = buildRecipeTree(elements);
    const modifiedCount = useConfiguratorStore((s) => getModifiedElements(s, "recipe").length);
    const currentElement = useConfiguratorStore((s) => s.currentElementId);
    const identifier = currentElement ? Identifier.fromUniqueKey(currentElement) : undefined;
    const isOverview = location.pathname.endsWith("/overview");
    const { setContainerRef } = useDynamicIsland();

    return (
        <TreeProvider config={{ overviewRoute, detailRoute, changesRoute, tabRoutes, tree, modifiedCount, folderIcons }}>
            <div className="flex size-full overflow-hidden relative z-10 isolate">
                <EditorSidebar title="recipe:overview.title" icon={RECIPE_ICON} linkTo="/$lang/studio/editor/recipe/overview">
                    <TreeSidebar />
                </EditorSidebar>

                <main ref={setContainerRef} className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative bg-zinc-950">
                    <EditorHeader
                        fallbackTitle="Recipe"
                        identifier={
                            identifier
                                ? { namespace: identifier.namespace, registry: identifier.registry, resource: identifier.resource }
                                : undefined
                        }
                        filterPath={filterPath}
                        isOverview={isOverview}
                        onBack={() => navigate({ to: "/$lang/studio/editor/recipe/overview", params: { lang } })}
                    />
                    <Outlet />
                </main>
            </div>
        </TreeProvider>
    );
}

import { createFileRoute, Outlet, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { isVoxel } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { RECIPE_BLOCKS } from "@/components/tools/concept/recipe/recipeConfig";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$lang/studio/editor/recipe")({
    component: RecipeLayout
});

const DEFAULT_BLOCK = "minecraft:barrier";

function RecipeLayout() {
    const { lang } = useParams({ from: "/$lang/studio/editor/recipe" });
    const { filterPath, setFilterPath, viewMode, setViewMode } = useEditorUiStore();
    const location = useLocation();
    const navigate = useNavigate();
    const isOverview = location.pathname.endsWith("/overview");
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const recipe = currentElement && isVoxel(currentElement, "recipe") ? currentElement : undefined;
    const selectedBlock = filterPath || DEFAULT_BLOCK;
    const blockConfig = RECIPE_BLOCKS.find((b) => b.id === selectedBlock);

    const handleBack = () => navigate({ to: "/$lang/studio/editor/recipe/overview", params: { lang } });
    const handleBlockSelect = (blockId: string) => {
        setFilterPath(blockId);
        navigate({ to: "/$lang/studio/editor/recipe/overview", params: { lang } });
    };

    return (
        <div className="flex size-full overflow-hidden relative z-10 isolate">
            <EditorSidebar
                title="recipe:overview.title"
                icon="/images/features/block/crafting_table.webp"
                linkTo="/$lang/studio/editor/recipe/overview">
                <div className="flex flex-col gap-1 mt-4">
                    {RECIPE_BLOCKS.map((block) => (
                        <button
                            key={block.id}
                            type="button"
                            onClick={() => handleBlockSelect(block.id)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left text-zinc-400",
                                selectedBlock === block.id ? "bg-zinc-800/50 text-zinc-100" : "hover:bg-zinc-800/30 hover:text-zinc-200"
                            )}>
                            <div className="size-5 scale-50">
                                <TextureRenderer id={block.id} />
                            </div>
                            <span>{block.name}</span>
                        </button>
                    ))}
                </div>
            </EditorSidebar>

            <main className="flex-1 flex flex-col min-w-0 relative bg-zinc-950">
                <EditorHeader
                    fallbackTitle="Recipe"
                    descriptionKey="recipe:overview.description"
                    identifier={recipe?.identifier}
                    filterPath={isOverview && blockConfig ? blockConfig.name : undefined}
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

import { createFileRoute } from "@tanstack/react-router";
import RecipeInventory from "@/components/tools/elements/recipe/RecipeInventory";
import RecipeSection from "@/components/tools/elements/recipe/RecipeSection";

export const Route = createFileRoute("/$lang/studio/editor/recipe/main")({
    component: RecipeMainPage
});

function RecipeMainPage() {
    return (
        <div className="w-full h-full">
            <div className="grid grid-cols-2 gap-8 items-start">
                <RecipeSection />
                <RecipeInventory />
            </div>
        </div>
    );
}

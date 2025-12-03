import { createFileRoute } from "@tanstack/react-router";
import SimpleStudio from "@/components/layout/SimpleStudio";
import RecipeInventory from "@/components/tools/concept/recipe/RecipeInventory";
import RecipeSection from "@/components/tools/concept/recipe/RecipeSection";

export const Route = createFileRoute("/$lang/studio/editor/recipe/main")({
    component: RecipeMainPage
});

function RecipeMainPage() {
    return (
        <SimpleStudio>
            <div className="grid grid-cols-2 gap-8 items-start">
                <RecipeSection />
                <RecipeInventory />
            </div>
        </SimpleStudio>
    );
}

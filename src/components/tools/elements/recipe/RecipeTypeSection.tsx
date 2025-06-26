import { Identifier, RecipeProps } from "@voxelio/breeze";
import RecipeItem from "./RecipeItem";
import { CRAFTING_TYPES } from "@/components/tools/section/recipe/overview/RecipeOverviewCard";

export default function RecipeTypeSection(props: {
    recipeType: string;
    recipes: RecipeProps[];
}) {
    return (
        <div>
            <h2 className="text-lg font-bold">{props.recipeType}</h2>
            <div className="flex flex-wrap gap-2">
                {props.recipes.map((recipe, index) => {
                    if (CRAFTING_TYPES.includes(recipe.type)) {
                        return <RecipeItem key={new Identifier(recipe.identifier).toUniqueKey() + `-${index}`} items={Object.values(recipe.slots).flat()} result={recipe.result} />
                    }
                    return null;
                })}
            </div>
        </div>
    );
}

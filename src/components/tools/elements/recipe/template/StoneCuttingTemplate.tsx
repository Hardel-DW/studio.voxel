import RecipeSlot from "@/components/tools/elements/recipe/RecipeSlot";
import RecipeTemplateBase from "@/components/tools/elements/recipe/RecipeTemplateBase";

interface StoneCuttingTemplateProps {
    slots: Record<string, string[] | string>;
    result: { item: string; count?: number };
}

export default function StoneCuttingTemplate({ slots, result }: StoneCuttingTemplateProps) {
    return (
        <RecipeTemplateBase result={result}>
            <RecipeSlot item={slots["0"]} />
        </RecipeTemplateBase>
    );
}

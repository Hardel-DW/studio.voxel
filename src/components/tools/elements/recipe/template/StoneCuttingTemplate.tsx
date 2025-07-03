"use client";

import RecipeSlot from "../RecipeSlot";
import RecipeTemplateBase from "../RecipeTemplateBase";

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

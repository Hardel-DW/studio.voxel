"use client";

import RecipeSlot from "../RecipeSlot";
import RecipeTemplateBase from "../RecipeTemplateBase";

// Items ARE ALWAYS an array. And Tags ARE ALWAYS a string. A tags can't be in an array. !!!
interface CraftingTemplateProps {
    slots: Record<string, string[] | string>; // "0" -> ["minecraft:diamond"], "1" -> "#minecraft:logs"
    result: {
        item: string;
        count?: number;
    };
}

export default function CraftingTemplate({ slots, result }: CraftingTemplateProps) {
    return (
        <RecipeTemplateBase result={result}>
            <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }, (_, index) => (
                    <RecipeSlot
                        key={index}
                        slotIndex={index.toString()}
                        item={slots[index.toString()]}
                        interactive={true}
                    />
                ))}
            </div>
        </RecipeTemplateBase>
    );
}

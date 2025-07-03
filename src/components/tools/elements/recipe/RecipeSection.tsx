import { isVoxel, RecipeProps } from "@voxelio/breeze";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { RecipeBlockManager } from "@/components/tools/section/recipe/recipeConfig";
import { useState } from "react";
import RecipeRenderer from "./RecipeRenderer";
import ToolCounter from "@/components/tools/elements/ToolCounter";
import { Actions, RecipeActionBuilder } from "@voxelio/breeze/core";
import { RECIPE_BLOCKS } from "@/components/tools/section/recipe/recipeConfig";
import Tabs from "@/components/ui/Tabs";
import dynamic from "next/dynamic";
import Loader from "@/components/ui/Loader";

const RecipeSelector = dynamic(() => import("./RecipeSelector"), {
    loading: () => <Loader />,
    ssr: false
});

const craftingTabs = [
    { label: "Shaped", value: "minecraft:crafting_shaped" },
    { label: "Shapeless", value: "minecraft:crafting_shapeless" },
    { label: "Transmute", value: "minecraft:crafting_transmute" }
];

const smithingTabs = [
    { label: "Smithing", value: "minecraft:smithing_transform" },
    { label: "Smithing", value: "minecraft:smithing_trim" }
];

export default function RecipeSection() {
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const handleChange = useConfiguratorStore((state) => state.handleChange);
    if (!currentElement || !isVoxel(currentElement, "recipe")) return null;
    const currentBlock = RecipeBlockManager.getBlockByRecipeType(currentElement.type);
    const [recipeType, setRecipeType] = useState<string>(currentBlock?.id ?? RECIPE_BLOCKS[0].id);

    const handleRecipeTypeChange = (blockId: string) => {
        const newRecipeType = RecipeBlockManager.getDefaultRecipeType(blockId);
        if (!newRecipeType) return;

        handleChange(new RecipeActionBuilder().convertType(newRecipeType).build());
        setRecipeType(blockId);
    };

    return (
        <div className="relative overflow-hidden bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 transition-all hover:ring-1 rounded-xl p-6">
            <div className="px-6 flex justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Recipe</h2>
                    <p className="text-sm text-zinc-400">Configure your recipe</p>
                </div>
                <div className="relative">
                    <RecipeSelector
                        recipeType={recipeType}
                        setRecipeType={handleRecipeTypeChange}
                        recipes={RecipeBlockManager.getAllBlockIds(false)}
                    />
                </div>
            </div>
            <hr />
            <div className="overflow-y-auto flex-1 px-6 pb-6 pt-2">
                <RecipeRenderer element={currentElement} />
                <hr />
                <div className=" mt-4 border rounded-lg border-zinc-900 p-4 flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-zinc-400">Result count</p>
                        <ToolCounter
                            min={1}
                            max={64}
                            step={1}
                            action={(value: number) => new Actions().setValue("result.count", value).build()}
                            renderer={(el: RecipeProps) => el.result.count}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-zinc-400">Recipe type</p>
                        {currentBlock && currentBlock.id === "minecraft:crafting_table" && (
                            <Tabs tabs={craftingTabs} defaultTab={currentElement.type} onChange={() => { }} />
                        )}
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}
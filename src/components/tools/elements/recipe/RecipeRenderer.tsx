import dynamic from "next/dynamic";
import { RecipeProps } from "@voxelio/breeze";
import Loader from "@/components/ui/Loader";
import { RecipeBlockManager } from "../../section/recipe/recipeConfig";

const CraftingTemplate = dynamic(() => import("./template/CraftingTemplate"), {
    loading: () => <Loader />,
    ssr: false
});

const SmeltingTemplate = dynamic(() => import("./template/SmeltingTemplate"), {
    loading: () => <Loader />,
    ssr: false
});

const StoneCuttingTemplate = dynamic(() => import("./template/StoneCuttingTemplate"), {
    loading: () => <Loader />,
    ssr: false
});

const SmithingTemplate = dynamic(() => import("./template/SmithingTemplate"), {
    loading: () => <Loader />,
    ssr: false
});

const templateMap = {
    "minecraft:crafting_table": CraftingTemplate,
    "minecraft:furnace": SmeltingTemplate,
    "minecraft:blast_furnace": SmeltingTemplate,
    "minecraft:smoker": SmeltingTemplate,
    "minecraft:campfire": SmeltingTemplate,
    "minecraft:stonecutter": StoneCuttingTemplate,
    "minecraft:smithing_table": SmithingTemplate
} as const;

export default function RecipeRenderer({ element }: { element: RecipeProps }) {
    const blockConfig = RecipeBlockManager.getBlockByRecipeType(element.type);
    if (!blockConfig) return null;

    const Template = templateMap[blockConfig.id as keyof typeof templateMap];
    return Template ? <Template slots={element.slots} result={element.result} /> : null;
}
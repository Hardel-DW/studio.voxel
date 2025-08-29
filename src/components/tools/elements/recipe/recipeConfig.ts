export interface RecipeBlockConfig {
    id: string;
    name: string;
    recipeTypes: string[];
    isSpecial?: boolean; // pour barrier (tous) et crafting_table (crafting_*)
}

export const RECIPE_BLOCKS: RecipeBlockConfig[] = [
    {
        id: "minecraft:barrier",
        name: "All Recipes",
        recipeTypes: [],
        isSpecial: true
    },
    {
        id: "minecraft:campfire",
        name: "Campfire",
        recipeTypes: ["minecraft:campfire_cooking"]
    },
    {
        id: "minecraft:furnace",
        name: "Furnace",
        recipeTypes: ["minecraft:smelting"]
    },
    {
        id: "minecraft:blast_furnace",
        name: "Blast Furnace",
        recipeTypes: ["minecraft:blasting"]
    },
    {
        id: "minecraft:smoker",
        name: "Smoker",
        recipeTypes: ["minecraft:smoking"]
    },
    {
        id: "minecraft:stonecutter",
        name: "Stonecutter",
        recipeTypes: ["minecraft:stonecutting"]
    },
    {
        id: "minecraft:crafting_table",
        name: "Crafting Table",
        recipeTypes: [
            "minecraft:crafting_shapeless",
            "minecraft:crafting_shaped",
            "minecraft:crafting_decorated_pot",
            "minecraft:crafting_special_armordye",
            "minecraft:crafting_special_bannerduplicate",
            "minecraft:crafting_special_bookcloning",
            "minecraft:crafting_special_firework_rocket",
            "minecraft:crafting_special_firework_star",
            "minecraft:crafting_special_firework_star_fade",
            "minecraft:crafting_special_mapcloning",
            "minecraft:crafting_special_mapextending",
            "minecraft:crafting_special_repairitem",
            "minecraft:crafting_special_shielddecoration",
            "minecraft:crafting_special_tippedarrow",
            "minecraft:crafting_transmute"
        ]
    },
    {
        id: "minecraft:smithing_table",
        name: "Smithing Table",
        recipeTypes: ["minecraft:smithing_transform", "minecraft:smithing_trim"]
    }
];

export class RecipeBlockManager {
    static getBlockConfig(blockId: string): RecipeBlockConfig | undefined {
        return RECIPE_BLOCKS.find((block) => block.id === blockId);
    }

    static getBlockByRecipeType(recipeType: string): RecipeBlockConfig {
        return RECIPE_BLOCKS.find((block) => block.recipeTypes.includes(recipeType)) ?? RECIPE_BLOCKS[0];
    }

    static getDefaultRecipeType(blockId: string): string | undefined {
        const config = RecipeBlockManager.getBlockConfig(blockId);
        return config?.recipeTypes[0];
    }

    static canBlockHandleRecipeType(blockId: string, recipeType: string): boolean {
        if (blockId === "minecraft:barrier") return true;

        const config = RecipeBlockManager.getBlockConfig(blockId);
        return config?.recipeTypes.some((type) => recipeType.includes(type)) ?? false;
    }

    static getAllBlockIds(includeSpecial: boolean = true): string[] {
        return RECIPE_BLOCKS.filter((block) => includeSpecial || !block.isSpecial).map((block) => block.id);
    }

    static getAllRecipeTypes(): string[] {
        return RECIPE_BLOCKS.filter((block) => !block.isSpecial) // Exclus barrier
            .flatMap((block) => block.recipeTypes);
    }

    static isBlockId(selection: string): boolean {
        return RECIPE_BLOCKS.some((block) => block.id === selection);
    }

    static getTypesFromSelection(selection: string): string[] {
        if (selection === "minecraft:barrier") return RecipeBlockManager.getAllRecipeTypes();
        const blockConfig = RecipeBlockManager.getBlockConfig(selection);
        return blockConfig?.recipeTypes || [selection];
    }

    static getFirstTypeFromSelection(selection: string): string {
        if (selection === "minecraft:barrier") return RecipeBlockManager.getAllRecipeTypes()[0];
        const blockConfig = RecipeBlockManager.getBlockConfig(selection);
        return blockConfig?.recipeTypes[0] || selection;
    }

    static getDisplayBlockId(selection: string): string {
        return RecipeBlockManager.isBlockId(selection) ? selection : RecipeBlockManager.getBlockByRecipeType(selection).id;
    }

    static getDisplayName(selection: string): string {
        if (RecipeBlockManager.isBlockId(selection)) {
            const config = RecipeBlockManager.getBlockConfig(selection);
            return config?.name || selection;
        }
        const cleanType = selection.replace("minecraft:", "");
        return cleanType
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
}

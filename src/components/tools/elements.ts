export type CONCEPT_KEY = "enchantment" | "loot_table" | "recipe" | "structure";

export type Concept = {
    registry: CONCEPT_KEY;
    title: string;
    description: string;
    image: { src: string; alt: string };
    tabs: Tab[];
};

export type Tab = {
    id: string;
    text: { key: string };
    path: string;
    soon?: boolean;
};

export const CONCEPTS: Concept[] = [
    {
        registry: "enchantment",
        title: "Enchantment",
        description: "Enchantment",
        image: {
            src: "/images/features/item/enchanted_book.webp",
            alt: "Enchantment"
        },
        tabs: [
            {
                id: "global",
                text: { key: "tools.enchantments.section.global" },
                path: "main"
            },
            {
                id: "find",
                text: { key: "tools.enchantments.section.find" },
                path: "find"
            },
            {
                id: "slots",
                text: { key: "tools.enchantments.section.slots" },
                path: "slot"
            },
            {
                id: "items",
                text: { key: "tools.enchantments.section.supported" },
                path: "item"
            },
            {
                id: "exclusive",
                text: { key: "tools.enchantments.section.exclusive" },
                path: "exclusive"
            },
            {
                id: "technical",
                text: { key: "tools.enchantments.section.technical" },
                path: "technical"
            }
        ]
    },
    {
        registry: "loot_table",
        title: "Loot Table",
        description: "Loot Table",
        image: {
            src: "/images/features/item/bundle_close.webp",
            alt: "Loot Table"
        },
        tabs: []
    },
    {
        registry: "recipe",
        title: "Recipe",
        description: "Recipe",
        image: {
            src: "/images/features/block/crafting_table.webp",
            alt: "Recipe"
        },
        tabs: []
    },
    {
        registry: "structure",
        title: "Structure",
        description: "Structure",
        image: {
            src: "/images/features/block/jigsaw.webp",
            alt: "Structure"
        },
        tabs: []
    }
];

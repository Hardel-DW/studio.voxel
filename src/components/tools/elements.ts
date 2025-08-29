export type CONCEPT_KEY = "enchantment" | "loot_table" | "recipe" | "structure";

export type Concept = {
    registry: CONCEPT_KEY;
    title: string;
    image: { src: string; alt: string };
    overview: string;
    tabs: Tab[];
};

export type Tab = {
    id: string;
    text: string;
    url: string;
    soon?: boolean;
};

export const CONCEPTS: Concept[] = [
    {
        registry: "enchantment",
        title: "Enchantment",
        image: {
            src: "/images/features/item/enchanted_book.webp",
            alt: "Enchantment"
        },
        overview: "/$lang/studio/editor/enchantment/overview",
        tabs: [
            {
                id: "global",
                text: "enchantment:section.global",
                url: "/$lang/studio/editor/enchantment/main"
            },
            {
                id: "find",
                text: "enchantment:section.find",
                url: "/$lang/studio/editor/enchantment/find"
            },
            {
                id: "slots",
                text: "enchantment:section.slots",
                url: "/$lang/studio/editor/enchantment/slots"
            },
            {
                id: "items",
                text: "enchantment:section.supported",
                url: "/$lang/studio/editor/enchantment/items"
            },
            {
                id: "exclusive",
                text: "enchantment:section.exclusive",
                url: "/$lang/studio/editor/enchantment/exclusive"
            },
            {
                id: "technical",
                text: "enchantment:section.technical",
                url: "/$lang/studio/editor/enchantment/technical"
            }
        ]
    },
    {
        registry: "loot_table",
        title: "Loot Table",
        image: {
            src: "/images/features/item/bundle_close.webp",
            alt: "Loot Table"
        },
        overview: "/$lang/studio/editor/loot/overview",
        tabs: [
            {
                id: "main",
                text: "loot_table:section.main",
                url: "/$lang/studio/editor/loot/main"
            }
        ]
    },
    {
        registry: "recipe",
        title: "Recipe",
        image: {
            src: "/images/features/block/crafting_table.webp",
            alt: "Recipe"
        },
        overview: "/$lang/studio/editor/recipe/overview",
        tabs: [
            {
                id: "main",
                text: "recipe:section.main",
                url: "/$lang/studio/editor/recipe/main"
            }
        ]
    },
    {
        registry: "structure",
        title: "Structure",
        image: {
            src: "/images/features/block/jigsaw.webp",
            alt: "Structure"
        },
        overview: "/$lang/studio/editor/structure/overview",
        tabs: []
    }
];

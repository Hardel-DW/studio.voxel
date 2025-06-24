export type CONCEPT_KEY = "enchantment" | "loot_table" | "recipe" | "structure";

export type Concept = {
    registry: CONCEPT_KEY;
    title: string;
    image: { src: string; alt: string };
    tabs: Tab[];
};

export type Tab = {
    id: string;
    text: { key: string };
    section: string;
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
        tabs: [
            {
                id: "global",
                text: { key: "enchantment:section.global" },
                section: "enchant.main"
            },
            {
                id: "find",
                text: { key: "enchantment:section.find" },
                section: "enchant.find"
            },
            {
                id: "slots",
                text: { key: "enchantment:section.slots" },
                section: "enchant.slot"
            },
            {
                id: "items",
                text: { key: "enchantment:section.supported" },
                section: "enchant.item"
            },
            {
                id: "exclusive",
                text: { key: "enchantment:section.exclusive" },
                section: "enchant.exclusive"
            },
            {
                id: "technical",
                text: { key: "enchantment:section.technical" },
                section: "enchant.technical"
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
        tabs: []
    },
    {
        registry: "recipe",
        title: "Recipe",
        image: {
            src: "/images/features/block/crafting_table.webp",
            alt: "Recipe"
        },
        tabs: []
    },
    {
        registry: "structure",
        title: "Structure",
        image: {
            src: "/images/features/block/jigsaw.webp",
            alt: "Structure"
        },
        tabs: []
    }
];

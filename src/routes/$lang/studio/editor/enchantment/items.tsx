import { createFileRoute } from "@tanstack/react-router";
import { Actions } from "@voxelio/breeze/core";
import type { EnchantmentProps } from "@voxelio/breeze/schema";
import { useState } from "react";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSectionSelector from "@/components/tools/elements/ToolSectionSelector";
import ToolSlot from "@/components/tools/elements/ToolSlot";

const items = {
    sword: "#minecraft:enchantable/sword",
    trident: "#minecraft:enchantable/trident",
    mace: "#minecraft:enchantable/mace",
    bow: "#minecraft:enchantable/bow",
    crossbow: "#minecraft:enchantable/crossbow",
    range: "#voxel:enchantable/range",
    fishing: "#minecraft:enchantable/fishing",
    shield: "#voxel:enchantable/shield",
    weapon: "#minecraft:enchantable/weapon",
    melee: "#voxel:enchantable/melee",
    head_armor: "#minecraft:enchantable/head_armor",
    chest_armor: "#minecraft:enchantable/chest_armor",
    leg_armor: "#minecraft:enchantable/leg_armor",
    foot_armor: "#minecraft:enchantable/foot_armor",
    elytra: "#voxel:enchantable/elytra",
    armor: "#minecraft:enchantable/armor",
    equippable: "#minecraft:enchantable/equippable",
    axes: "#voxel:enchantable/axes",
    shovels: "#voxel:enchantable/shovels",
    hoes: "#voxel:enchantable/hoes",
    pickaxes: "#voxel:enchantable/pickaxes",
    durability: "#minecraft:enchantable/durability",
    mining_loot: "#minecraft:enchantable/mining_loot"
};

const elements = [
    {
        id: "supportedItems",
        title: "enchantment:toggle.supported.title"
    },
    {
        id: "primaryItems",
        title: "enchantment:toggle.primary.title"
    }
];

export const Route = createFileRoute("/$lang/studio/editor/enchantment/items")({
    component: EnchantmentItemsPage
});

function EnchantmentItemsPage() {
    const [section, setSection] = useState<string>(elements[0].id);

    return (
        <ToolSectionSelector
            id="slots"
            title="enchantment:section.slots.description"
            elements={elements}
            value={section}
            setValue={setSection}>
            <ToolGrid>
                {Object.keys(items).map((item) => (
                    <ToolSlot
                        key={item}
                        title={`enchantment:supported.${item}.title`}
                        image={`/images/features/item/${item}.webp`}
                        action={new Actions().setValue(section, items[item as keyof typeof items]).build()}
                        renderer={(el: EnchantmentProps) => el[section] === items[item as keyof typeof items]}
                    />
                ))}

                {section === "primaryItems" && (
                    <ToolSlot
                        title="enchantment:supported.none.title"
                        image="/images/tools/cross.webp"
                        action={new Actions().setUndefined("primaryItems").build()}
                        renderer={(el: EnchantmentProps) => el.primaryItems === undefined}
                    />
                )}
            </ToolGrid>
        </ToolSectionSelector>
    );
}

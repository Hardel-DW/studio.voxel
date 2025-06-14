"use client";

import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSectionSelector from "@/components/tools/elements/ToolSectionSelector";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import { Actions } from "@voxelio/breeze/core";
import type { EnchantmentProps } from "@voxelio/breeze/schema";
import React, { useState } from "react";

const items = [
    "sword",
    "trident",
    "mace",
    "bow",
    "crossbow",
    "range",
    "fishing",
    "shield",
    "weapon",
    "melee",
    "head_armor",
    "chest_armor",
    "leg_armor",
    "foot_armor",
    "elytra",
    "armor",
    "equippable",
    "axes",
    "shovels",
    "hoes",
    "pickaxes",
    "durability",
    "mining_loot"
];

const elements = [
    {
        id: "primaryItems",
        title: { key: "tools.enchantments.section.toggle.primary.title" }
    },
    {
        id: "supportedItems",
        title: { key: "tools.enchantments.section.toggle.supported.title" }
    }
];

export default function EnchantSlotsSection() {
    const [section, setSection] = useState<string>(elements[0].id);

    return (
        <ToolSectionSelector
            id="slots"
            title={{ key: "tools.enchantments.section.slots.description" }}
            elements={elements}
            value={section}
            setValue={setSection}>
            <ToolGrid>
                {items.map((item) => (
                    <ToolSlot
                        key={item}
                        title={{ key: `tools.enchantments.section.slots.${item}.title` }}
                        image={`/images/features/slots/${item}.webp`}
                        action={(value: string) => new Actions().setValue(section, value).build()}
                        renderer={(el: EnchantmentProps) => el[item] === section}
                    />
                ))}

                {section === "primaryItems" && (
                    <ToolSlot
                        title={{
                            key: "tools.enchantments.section.supported.components.none.title"
                        }}
                        image="/images/tools/cross.webp"
                        action={new Actions().setUndefined("primaryItems").build()}
                        renderer={(el: EnchantmentProps) => el.primaryItems === undefined}
                    />
                )}
            </ToolGrid>
        </ToolSectionSelector>
    );
}

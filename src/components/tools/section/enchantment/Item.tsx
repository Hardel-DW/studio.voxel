"use client";

import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSectionSelector from "@/components/tools/elements/ToolSectionSelector";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import type { Action, ValueRenderer } from "@voxelio/breeze/core";
import React, { useState } from "react";

const generateAction = (value: string, field: string): Action => {
    return {
        type: "set_value",
        field: field,
        value: value
    };
};

const generateRenderer = (value: string, field: string): ValueRenderer => {
    return {
        type: "conditionnal",
        return_condition: true,
        term: {
            condition: "compare_value_to_field_value",
            field: field,
            value: value
        }
    };
};
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
                        action={generateAction(item, section)}
                        renderer={generateRenderer(item, section)}
                    />
                ))}

                {section === "primaryItems" && (
                    <ToolSlot
                        title={{
                            key: "tools.enchantments.section.supported.components.none.title"
                        }}
                        image="/images/tools/cross.webp"
                        action={{ type: "set_undefined", field: "primaryItems" }}
                        renderer={{
                            type: "conditionnal",
                            return_condition: true,
                            term: {
                                condition: "if_field_is_undefined",
                                field: "primaryItems"
                            }
                        }}
                    />
                )}
            </ToolGrid>
        </ToolSectionSelector>
    );
}

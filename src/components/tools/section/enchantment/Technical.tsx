import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolRange from "@/components/tools/elements/ToolRange";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSwitch from "@/components/tools/elements/ToolSwitch";
import ToolProperty from "@/components/tools/elements/schema/property/ToolProperty";
import type { Lock } from "@/components/tools/types/component";
import type { Action, ValueRenderer } from "@voxelio/breeze/core";
import React from "react";

const generateToggleAction = (value: string): Action => {
    return {
        type: "toggle_value_in_list",
        field: "tags",
        value: value
    };
};

const generateConditionalRenderer = (value: string | string[]): ValueRenderer => {
    return {
        type: "conditionnal",
        return_condition: true,
        term: {
            condition: "contains",
            field: "tags",
            values: Array.isArray(value) ? value : [value]
        }
    };
};

const generateSetValueAction = (field: string): Action => {
    return {
        type: "set_value_from_computed_value",
        field: field
    };
};

const generateFieldRenderer = (field: string): ValueRenderer => {
    return {
        type: "from_field",
        field: field
    };
};

const isMinecraft: Lock[] = [
    {
        text: {
            key: "tools.disabled_because_vanilla"
        },
        condition: {
            condition: "object",
            field: "identifier",
            terms: {
                condition: "compare_value_to_field_value",
                field: "namespace",
                value: "minecraft"
            }
        }
    }
];

export default function EnchantTechnicalSection() {
    return (
        <>
            {/* Technical Behaviour Section */}
            <ToolSection id="technical_behaviour" title={{ key: "tools.enchantments.section.technical.description" }}>
                <ToolSwitch
                    title={{ key: "tools.enchantments.section.technical.components.curse.title" }}
                    description={{
                        key: "tools.enchantments.section.technical.components.curse.description"
                    }}
                    action={generateToggleAction("#minecraft:curse")}
                    renderer={generateConditionalRenderer("#minecraft:curse")}
                    lock={isMinecraft}
                />
                <ToolSwitch
                    title={{
                        key: "tools.enchantments.section.technical.components.nonTreasure.title"
                    }}
                    description={{
                        key: "tools.enchantments.section.technical.components.nonTreasure.description"
                    }}
                    action={generateToggleAction("#minecraft:non_treasure")}
                    renderer={generateConditionalRenderer("#minecraft:non_treasure")}
                    lock={isMinecraft}
                />
                <ToolSwitch
                    title={{ key: "tools.enchantments.section.technical.components.treasure.title" }}
                    description={{
                        key: "tools.enchantments.section.technical.components.treasure.description"
                    }}
                    action={generateToggleAction("#minecraft:treasure")}
                    renderer={generateConditionalRenderer("#minecraft:treasure")}
                    lock={isMinecraft}
                />
                <ToolSwitch
                    title={{
                        key: "tools.enchantments.section.technical.components.smeltsLoot.title"
                    }}
                    description={{
                        key: "tools.enchantments.section.technical.components.smeltsLoot.description"
                    }}
                    action={generateToggleAction("#minecraft:smelts_loot")}
                    renderer={generateConditionalRenderer("#minecraft:smelts_loot")}
                    lock={isMinecraft}
                />
                <ToolGrid>
                    <ToolSwitch
                        title={{
                            key: "tools.enchantments.section.technical.components.preventsIceMelting.title"
                        }}
                        description={{
                            key: "tools.enchantments.section.technical.components.preventsIceMelting.description"
                        }}
                        action={generateToggleAction("#minecraft:prevent_ice_melting")}
                        renderer={generateConditionalRenderer("#minecraft:prevent_ice_melting")}
                        lock={isMinecraft}
                    />
                    <ToolSwitch
                        title={{
                            key: "tools.enchantments.section.technical.components.preventInfestedBlockSpawning.title"
                        }}
                        description={{
                            key: "tools.enchantments.section.technical.components.preventInfestedBlockSpawning.description"
                        }}
                        action={generateToggleAction("#minecraft:prevent_infested_block_spawning")}
                        renderer={generateConditionalRenderer("#minecraft:prevent_infested_block_spawning")}
                        lock={isMinecraft}
                    />
                </ToolGrid>
                <ToolGrid>
                    <ToolSwitch
                        title={{
                            key: "tools.enchantments.section.technical.components.preventBeeSpawning.title"
                        }}
                        description={{
                            key: "tools.enchantments.section.technical.components.preventBeeSpawning.description"
                        }}
                        action={generateToggleAction("#minecraft:prevent_bee_spawning")}
                        renderer={generateConditionalRenderer("#minecraft:prevent_bee_spawning")}
                        lock={isMinecraft}
                    />
                    <ToolSwitch
                        title={{
                            key: "tools.enchantments.section.technical.components.preventPotShattering.title"
                        }}
                        description={{
                            key: "tools.enchantments.section.technical.components.preventPotShattering.description"
                        }}
                        action={generateToggleAction("#minecraft:prevent_pot_shattering")}
                        renderer={generateConditionalRenderer("#minecraft:prevent_pot_shattering")}
                        lock={isMinecraft}
                    />
                </ToolGrid>
            </ToolSection>

            {/* Costs Section */}
            <ToolSection
                id="costs"
                title={{ key: "tools.enchantments.section.costs" }}
                button={{ text: { key: "generic.documentation" }, url: "https://minecraft.wiki/w/Enchanting_mechanics" }}>
                {[
                    ["minCostBase", "minCostPerLevelAboveFirst"],
                    ["maxCostBase", "maxCostPerLevelAboveFirst"]
                ].map((fields) => (
                    <ToolGrid key={fields[0]}>
                        {fields.map((field) => (
                            <ToolRange
                                key={field}
                                type="Range"
                                label={{
                                    key: `tools.enchantments.section.global.components.${field}.label`
                                }}
                                min={0}
                                max={100}
                                step={1}
                                action={generateSetValueAction(field)}
                                renderer={generateFieldRenderer(field)}
                            />
                        ))}
                    </ToolGrid>
                ))}
            </ToolSection>

            {/* Effects Section */}
            <ToolSection id="effects" title={{ key: "tools.enchantments.section.effects.components.title" }}>
                <ToolProperty
                    action={{ type: "toggle_value_in_list", field: "disabledEffects" }}
                    renderer={{ type: "from_field", field: "effects" }}
                    condition={{ condition: "contains", field: "disabledEffects" }}
                />
            </ToolSection>
        </>
    );
}

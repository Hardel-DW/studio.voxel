import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolRange from "@/components/tools/elements/ToolRange";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSwitch from "@/components/tools/elements/ToolSwitch";
import Translate from "@/components/tools/Translate";
import { Actions, Identifier, isVoxel } from "@voxelio/breeze/core";
import type { EnchantmentProps } from "@voxelio/breeze/schema";
import { isMinecraft } from "@/lib/utils/lock";
import React from "react";
import { getCurrentElement, useConfiguratorStore } from "../../Store";

export default function EnchantTechnicalSection() {
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));

    return (
        <>
            <ToolSection id="technical_behaviour" title={{ key: "tools.enchantments.section.technical.description" }}>
                <ToolSwitch
                    title={{ key: "tools.enchantments.section.technical.components.curse.title" }}
                    description={{ key: "tools.enchantments.section.technical.components.curse.description" }}
                    action={new Actions().toggleValueInList("tags", "#minecraft:curse").build()}
                    renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:curse")}
                    lock={[isMinecraft]}
                />
                <ToolSwitch
                    title={{ key: "tools.enchantments.section.technical.components.nonTreasure.title" }}
                    description={{
                        key: "tools.enchantments.section.technical.components.nonTreasure.description"
                    }}
                    action={new Actions().toggleValueInList("tags", "#minecraft:non_treasure").build()}
                    renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:non_treasure")}
                    lock={[isMinecraft]}
                />
                <ToolSwitch
                    title={{ key: "tools.enchantments.section.technical.components.treasure.title" }}
                    description={{ key: "tools.enchantments.section.technical.components.treasure.description" }}
                    action={new Actions().toggleValueInList("tags", "#minecraft:treasure").build()}
                    renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:treasure")}
                    lock={[isMinecraft]}
                />
                <ToolSwitch
                    title={{
                        key: "tools.enchantments.section.technical.components.smeltsLoot.title"
                    }}
                    description={{
                        key: "tools.enchantments.section.technical.components.smeltsLoot.description"
                    }}
                    action={new Actions().toggleValueInList("tags", "#minecraft:smelts_loot").build()}
                    renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:smelts_loot")}
                    lock={[isMinecraft]}
                />
                <ToolGrid>
                    <ToolSwitch
                        title={{
                            key: "tools.enchantments.section.technical.components.preventsIceMelting.title"
                        }}
                        description={{
                            key: "tools.enchantments.section.technical.components.preventsIceMelting.description"
                        }}
                        action={new Actions().toggleValueInList("tags", "#minecraft:prevent_ice_melting").build()}
                        renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:prevent_ice_melting")}
                        lock={[isMinecraft]}
                    />
                    <ToolSwitch
                        title={{
                            key: "tools.enchantments.section.technical.components.preventInfestedBlockSpawning.title"
                        }}
                        description={{
                            key: "tools.enchantments.section.technical.components.preventInfestedBlockSpawning.description"
                        }}
                        action={new Actions().toggleValueInList("tags", "#minecraft:prevent_infested_block_spawning").build()}
                        renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:prevent_infested_block_spawning")}
                        lock={[isMinecraft]}
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
                        action={new Actions().toggleValueInList("tags", "#minecraft:prevent_bee_spawning").build()}
                        renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:prevent_bee_spawning")}
                        lock={[isMinecraft]}
                    />
                    <ToolSwitch
                        title={{
                            key: "tools.enchantments.section.technical.components.preventPotShattering.title"
                        }}
                        description={{
                            key: "tools.enchantments.section.technical.components.preventPotShattering.description"
                        }}
                        action={new Actions().toggleValueInList("tags", "#minecraft:prevent_pot_shattering").build()}
                        renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:prevent_pot_shattering")}
                        lock={[isMinecraft]}
                    />
                </ToolGrid>
            </ToolSection>

            <ToolSection
                id="costs"
                title={{ key: "tools.enchantments.section.costs" }}
                button={{ text: { key: "generic.documentation" }, url: "https://minecraft.wiki/w/Enchanting_mechanics" }}>
                <div className="grid grid-cols-2 gap-4">
                    {["minCostBase", "minCostPerLevelAboveFirst", "maxCostBase", "maxCostPerLevelAboveFirst"].map((field) => (
                        <div key={field}>
                            <ToolRange
                                key={field}
                                type="Range"
                                label={{
                                    key: `tools.enchantments.section.global.components.${field}.label`
                                }}
                                min={0}
                                max={100}
                                step={1}
                                action={(value: number) => new Actions().setValue(field, value).build()}
                                renderer={(el: EnchantmentProps) => el[field]}
                            />
                        </div>
                    ))}
                </div>
            </ToolSection>

            <ToolSection id="effects" title={{ key: "tools.enchantments.section.effects.components.title" }}>
                {currentElement &&
                isVoxel(currentElement, "enchantment") &&
                currentElement?.effects &&
                Object.keys(currentElement.effects).length > 0 ? (
                    Object.keys(currentElement.effects).map((effect) => (
                        <ToolSwitch
                            key={effect}
                            title={Identifier.toDisplay(effect)}
                            description={{ key: `tools.effects.${effect}` }}
                            action={new Actions().toggleValueInList("disabledEffects", effect).build()}
                            renderer={(el: EnchantmentProps) => !el.disabledEffects.includes(effect)}
                        />
                    ))
                ) : (
                    <h1 className="text-zinc-400 text-center py-4">
                        <Translate content="tools.enchantments.section.effects.components.empty" />
                    </h1>
                )}
            </ToolSection>
        </>
    );
}

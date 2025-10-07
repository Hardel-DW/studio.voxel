import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction, Identifier } from "@voxelio/breeze";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolRange from "@/components/tools/elements/ToolRange";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSwitch from "@/components/tools/elements/ToolSwitch";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { useElementProperty } from "@/lib/hook/useBreezeElement";
import { isMinecraft } from "@/lib/utils/lock";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/technical")({
    component: EnchantmentTechnicalPage
});

function EnchantmentTechnicalPage() {
    const currentElementId = useConfiguratorStore((state) => state.currentElementId);
    const effectKeys = useElementProperty((el) => (el?.effects ? Object.keys(el.effects) : []), currentElementId, !!currentElementId);
    if (!currentElementId) return null;

    return (
        <>
            <ToolSection id="technical_behaviour" title="enchantment:section.technical.description">
                <ToolSwitch
                    title="enchantment:technical.curse.title"
                    description="enchantment:technical.curse.description"
                    action={CoreAction.toggleValueInList("tags", "#minecraft:curse")}
                    renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:curse")}
                    lock={[isMinecraft]}
                />
                <ToolSwitch
                    title="enchantment:technical.nonTreasure.title"
                    description="enchantment:technical.nonTreasure.description"
                    action={CoreAction.toggleValueInList("tags", "#minecraft:non_treasure")}
                    renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:non_treasure")}
                    lock={[isMinecraft]}
                />
                <ToolSwitch
                    title="enchantment:technical.treasure.title"
                    description="enchantment:technical.treasure.description"
                    action={CoreAction.toggleValueInList("tags", "#minecraft:treasure")}
                    renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:treasure")}
                    lock={[isMinecraft]}
                />
                <ToolSwitch
                    title="enchantment:technical.smeltsLoot.title"
                    description="enchantment:technical.smeltsLoot.description"
                    action={CoreAction.toggleValueInList("tags", "#minecraft:smelts_loot")}
                    renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:smelts_loot")}
                    lock={[isMinecraft]}
                />
                <ToolGrid>
                    <ToolSwitch
                        title="enchantment:technical.preventsIceMelting.title"
                        description="enchantment:technical.preventsIceMelting.description"
                        action={CoreAction.toggleValueInList("tags", "#minecraft:prevent_ice_melting")}
                        renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:prevent_ice_melting")}
                        lock={[isMinecraft]}
                    />
                    <ToolSwitch
                        title="enchantment:technical.preventInfestedBlockSpawning.title"
                        description="enchantment:technical.preventInfestedBlockSpawning.description"
                        action={CoreAction.toggleValueInList("tags", "#minecraft:prevent_infested_block_spawning")}
                        renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:prevent_infested_block_spawning")}
                        lock={[isMinecraft]}
                    />
                </ToolGrid>
                <ToolGrid>
                    <ToolSwitch
                        title="enchantment:technical.preventBeeSpawning.title"
                        description="enchantment:technical.preventBeeSpawning.description"
                        action={CoreAction.toggleValueInList("tags", "#minecraft:prevent_bee_spawning")}
                        renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:prevent_bee_spawning")}
                        lock={[isMinecraft]}
                    />
                    <ToolSwitch
                        title="enchantment:technical.preventPotShattering.title"
                        description="enchantment:technical.preventPotShattering.description"
                        action={CoreAction.toggleValueInList("tags", "#minecraft:prevent_pot_shattering")}
                        renderer={(el: EnchantmentProps) => el.tags.includes("#minecraft:prevent_pot_shattering")}
                        lock={[isMinecraft]}
                    />
                </ToolGrid>
            </ToolSection>

            <ToolSection
                id="costs"
                title="enchantment:section.costs"
                button={{ text: "documentation", url: "https://minecraft.wiki/w/Enchanting_mechanics" }}>
                <div className="grid grid-cols-2 gap-4">
                    {["minCostBase", "minCostPerLevelAboveFirst", "maxCostBase", "maxCostPerLevelAboveFirst"].map((field) => (
                        <div key={field}>
                            <ToolRange
                                key={field}
                                label={`enchantment:global.${field}.title`}
                                min={0}
                                max={100}
                                step={1}
                                action={(value: number) => CoreAction.setValue(field, value)}
                                renderer={(el: EnchantmentProps) => el[field]}
                            />
                        </div>
                    ))}
                </div>
            </ToolSection>

            <ToolSection id="effects" title="enchantment:technical.effects.title">
                {effectKeys && effectKeys.length > 0 ? (
                    effectKeys.map((effect) => (
                        <ToolSwitch
                            key={effect}
                            title={Identifier.toDisplay(effect)}
                            description={`effects:${effect}`}
                            action={CoreAction.toggleValueInList("disabledEffects", effect)}
                            renderer={(el: EnchantmentProps) => !el.disabledEffects.includes(effect)}
                        />
                    ))
                ) : (
                    <h1 className="text-zinc-400 text-center py-4">
                        <Translate content="enchantment:technical.empty_effects" />
                    </h1>
                )}
            </ToolSection>
        </>
    );
}

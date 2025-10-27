import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction, Identifier } from "@voxelio/breeze";
import ToolRange from "@/components/tools/elements/ToolRange";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSwitch from "@/components/tools/elements/ToolSwitch";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/ui/Translate";
import { useElementProperty } from "@/lib/hook/useBreezeElement";
import { isMinecraft } from "@/lib/utils/lock";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/technical")({
    component: EnchantmentTechnicalPage
});

const FIELDS = [
    "curse",
    "non_treasure",
    "treasure",
    "smelts_loot",
    "prevent_ice_melting",
    "prevent_infested_block_spawning",
    "prevent_bee_spawning",
    "prevent_pot_shattering"
];

function EnchantmentTechnicalPage() {
    const currentElementId = useConfiguratorStore((state) => state.currentElementId);
    const effectKeys = useElementProperty((el) => (el?.effects ? Object.keys(el.effects) : []), currentElementId, !!currentElementId);
    if (!currentElementId) return null;

    return (
        <>
            <ToolSection id="technical_behaviour" title="enchantment:section.technical.description">
                {FIELDS.slice(0, 4).map((field) => (
                    <ToolSwitch
                        key={field}
                        title={`enchantment:technical.${field}.title`}
                        description={`enchantment:technical.${field}.description`}
                        action={CoreAction.toggleValueInList("tags", `#minecraft:${field}`)}
                        renderer={(el: EnchantmentProps) => el.tags.includes(`#minecraft:${field}`)}
                        lock={[isMinecraft]}
                    />
                ))}
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                    {FIELDS.slice(4).map((field) => (
                        <ToolSwitch
                            key={field}
                            title={`enchantment:technical.${field}.title`}
                            description={`enchantment:technical.${field}.description`}
                            action={CoreAction.toggleValueInList("tags", `#minecraft:${field}`)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(`#minecraft:${field}`)}
                            lock={[isMinecraft]}
                        />
                    ))}
                </div>
            </ToolSection>

            <ToolSection
                id="costs"
                title="enchantment:section.costs"
                button={{ text: "documentation", url: "https://minecraft.wiki/w/Enchanting_mechanics" }}>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
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

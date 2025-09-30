import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps, SlotRegistryType } from "@voxelio/breeze";
import { EnchantmentAction } from "@voxelio/breeze";
import { SLOT_CONFIGS } from "@/components/tools/concept/enchantment/slots";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import Translate from "@/components/tools/Translate";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/slots")({
    component: EnchantmentSlotsPage
});

function EnchantmentSlotsPage() {
    const groupedSlots = [
        SLOT_CONFIGS.filter((config) => ["mainhand", "offhand"].includes(config.id)),
        SLOT_CONFIGS.filter((config) => ["body", "saddle"].includes(config.id)),
        SLOT_CONFIGS.filter((config) => ["head", "chest", "legs", "feet"].includes(config.id))
    ];

    return (
        <ToolSection id="slots" title="enchantment:section.slots.description">
            {groupedSlots.map((group) => (
                <ToolGrid key={group.map((config) => config.id).join(",")}>
                    {group.map((config) => (
                        <ToolSlot
                            key={config.id}
                            title={config.name}
                            image={config.image}
                            action={EnchantmentAction.setComputedSlot("slots", config.id as SlotRegistryType)}
                            renderer={(el: EnchantmentProps) => el.slots.some((slot) => config.slots.includes(slot))}
                        />
                    ))}
                </ToolGrid>
            ))}

            <div className="flex flex-col gap-4 p-4">
                <p className="text-zinc-300">
                    <Translate content="enchantment:slots.explanation.title" />
                </p>
                <div>
                    <ul className="list-disc list-inside space-y-2">
                        <li className="text-zinc-400">
                            <Translate content="enchantment:slots.explanation.list.1" />
                        </li>
                        <li className="text-zinc-400">
                            <Translate content="enchantment:slots.explanation.list.2" />
                        </li>
                    </ul>
                </div>
            </div>
        </ToolSection>
    );
}

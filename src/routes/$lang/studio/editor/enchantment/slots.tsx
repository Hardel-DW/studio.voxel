import { createFileRoute } from "@tanstack/react-router";
import { EnchantmentActionBuilder } from "@voxelio/breeze/core";
import type { EnchantmentProps } from "@voxelio/breeze/schema";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import Translate from "@/components/tools/Translate";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/slots")({
    component: EnchantmentSlotsPage
});

function EnchantmentSlotsPage() {
    return (
        <ToolSection id="slots" title="enchantment:section.slots.description">
            <ToolGrid>
                <ToolSlot
                    title="enchantment:slots.mainhand.title"
                    image="/images/features/slots/mainhand.webp"
                    action={new EnchantmentActionBuilder().setComputedSlot("slots", "mainhand").build()}
                    renderer={(el: EnchantmentProps) => el.slots.some((slot) => ["mainhand", "any", "hand"].includes(slot))}
                />
                <ToolSlot
                    title="enchantment:slots.offhand.title"
                    image="/images/features/slots/offhand.webp"
                    action={new EnchantmentActionBuilder().setComputedSlot("slots", "offhand").build()}
                    renderer={(el: EnchantmentProps) => el.slots.some((slot) => ["offhand", "any", "hand"].includes(slot))}
                />
            </ToolGrid>
            <ToolGrid>
                <ToolSlot
                    title="enchantment:slots.body.title"
                    image="/images/features/slots/body.webp"
                    action={new EnchantmentActionBuilder().setComputedSlot("slots", "body").build()}
                    renderer={(el: EnchantmentProps) => el.slots.some((slot) => ["body", "any"].includes(slot))}
                />
                <ToolSlot
                    title="enchantment:slots.saddle.title"
                    image="/images/features/slots/saddle.webp"
                    action={new EnchantmentActionBuilder().setComputedSlot("slots", "saddle").build()}
                    renderer={(el: EnchantmentProps) => el.slots.some((slot) => ["saddle", "any"].includes(slot))}
                />
            </ToolGrid>
            <ToolGrid>
                <ToolSlot
                    title="enchantment:slots.head.title"
                    image="/images/features/slots/head.webp"
                    action={new EnchantmentActionBuilder().setComputedSlot("slots", "head").build()}
                    renderer={(el: EnchantmentProps) => el.slots.some((slot) => ["head", "any", "armor"].includes(slot))}
                />
                <ToolSlot
                    title="enchantment:slots.chest.title"
                    image="/images/features/slots/chest.webp"
                    action={new EnchantmentActionBuilder().setComputedSlot("slots", "chest").build()}
                    renderer={(el: EnchantmentProps) => el.slots.some((slot) => ["chest", "any", "armor"].includes(slot))}
                />
                <ToolSlot
                    title="enchantment:slots.legs.title"
                    image="/images/features/slots/legs.webp"
                    action={new EnchantmentActionBuilder().setComputedSlot("slots", "legs").build()}
                    renderer={(el: EnchantmentProps) => el.slots.some((slot) => ["legs", "any", "armor"].includes(slot))}
                />
                <ToolSlot
                    title="enchantment:slots.feet.title"
                    image="/images/features/slots/feet.webp"
                    action={new EnchantmentActionBuilder().setComputedSlot("slots", "feet").build()}
                    renderer={(el: EnchantmentProps) => el.slots.some((slot) => ["feet", "any", "armor"].includes(slot))}
                />
            </ToolGrid>

            <div className="flex flex-col gap-4 p-4">
                <div>
                    <p className="text-zinc-300">
                        <Translate content="enchantment:slots.explanation.title" />
                    </p>
                </div>
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

import type { EnchantmentProps, SlotRegistryType } from "@voxelio/breeze";
import { EnchantmentActionBuilder } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import { SlotButton } from "./SlotButton";
import { SLOT_CONFIGS } from "./slots";

export default function SlotGrid(props: { element: EnchantmentProps; elementId: string }) {
    const handleSlotToggle = (slotId: SlotRegistryType) => {
        useConfiguratorStore
            .getState()
            .handleChange(new EnchantmentActionBuilder().setComputedSlot("slots", slotId).build(), props.elementId);
    };

    const isActive = (slot: (typeof SLOT_CONFIGS)[0]) => props.element.slots.some((elementSlot) => slot.slots.includes(elementSlot));

    return (
        <div className="flex flex-col gap-3">
            {/* Première ligne : mainhand, offhand */}
            <div className="grid grid-cols-2 gap-3">
                <SlotButton slot={SLOT_CONFIGS[0]} isActive={isActive(SLOT_CONFIGS[0])} onToggle={handleSlotToggle} />
                <SlotButton slot={SLOT_CONFIGS[1]} isActive={isActive(SLOT_CONFIGS[1])} onToggle={handleSlotToggle} />
            </div>

            {/* Deuxième ligne : body, saddle */}
            <div className="grid grid-cols-2 gap-3">
                <SlotButton slot={SLOT_CONFIGS[2]} isActive={isActive(SLOT_CONFIGS[2])} onToggle={handleSlotToggle} />
                <SlotButton slot={SLOT_CONFIGS[3]} isActive={isActive(SLOT_CONFIGS[3])} onToggle={handleSlotToggle} />
            </div>

            {/* Troisième ligne : armor slots */}
            <div className="grid grid-cols-4 gap-2">
                {SLOT_CONFIGS.slice(4).map((slot) => (
                    <SlotButton key={slot.id} slot={slot} isActive={isActive(slot)} onToggle={handleSlotToggle} />
                ))}
            </div>
        </div>
    );
}

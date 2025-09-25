import { Link, useParams } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { Actions, flattenSlots, getItemFromMultipleOrOne, Identifier } from "@voxelio/breeze";
import { useRef } from "react";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import useTagManager from "@/lib/hook/useTagManager";
import { cn } from "@/lib/utils";
import SlotGrid from "./SlotGrid";

const SLOT_IMAGES = {
    mainhand: "/images/features/slots/mainhand.webp",
    offhand: "/images/features/slots/offhand.webp",
    head: "/images/features/slots/head.webp",
    chest: "/images/features/slots/chest.webp",
    legs: "/images/features/slots/legs.webp",
    feet: "/images/features/slots/feet.webp",
    body: "/images/features/slots/body.webp",
    saddle: "/images/features/slots/saddle.webp",
    any: "/images/features/slots/mainhand.webp",
    hand: "/images/features/slots/mainhand.webp",
    armor: "/images/features/slots/head.webp"
};

interface SlotsEnchantmentCardProps {
    element: EnchantmentProps;
}

export default function SlotsEnchantmentCard({ element }: SlotsEnchantmentCardProps) {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const { lang } = useParams({ from: "/$lang" });
    const { getAllItemsFromTag } = useTagManager();
    const elementId = new Identifier(element.identifier).toUniqueKey();
    const { isTag, id } = getItemFromMultipleOrOne(element.supportedItems);
    const items = isTag ? getAllItemsFromTag(id) : [id];

    const flattenedSlots = flattenSlots(element.slots);

    const handleConfigure = () => {
        useConfiguratorStore.getState().setCurrentElementId(elementId);
    };

    const handlePopoverChange = (isOpen: boolean) => {
        if (!cardRef.current) return;
        cardRef.current.toggleAttribute("data-popover-open", isOpen);
    };

    return (
        <div
            ref={cardRef}
            data-element-id={elementId}
            className={cn(
                "overview-card bg-black/50 border-t-2 border-l-2 shadow-xl shadow-black/30 border-stone-900 select-none relative transition-all hover:ring-2 ring-zinc-900 rounded-xl p-4 h-full group",
                "flex flex-col"
            )}>
            {/* Header avec switch */}
            <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {items.length === 0 ? (
                        <div className="w-6 h-6 bg-stone-900 rounded-full animate-pulse flex-shrink-0" />
                    ) : (
                        <div className="flex-shrink-0">
                            <TextureRenderer id={items[0]} />
                        </div>
                    )}
                    <div className="flex flex-col gap-1 justify-center">
                        <h3 className="text-sm font-semibold truncate">{new Identifier(element.identifier).toResourceName()}</h3>
                        <div className="flex items-center">
                            <div className="bg-zinc-800/20 pr-2 pl-1 py-px rounded-full border border-zinc-800">
                                <div className="flex items-center gap-1">
                                    <img src="/icons/tools/maxLevel.svg" alt="Max Level" className="invert-70 w-3 h-3" />
                                    <span className="text-xs tracking-wider text-zinc-400 font-medium">
                                        <Translate content="enchantment:overview.level" /> {element.maxLevel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SimpleSwitch
                    elementId={elementId}
                    action={new Actions()
                        .alternative((el) => el.mode === "soft_delete")
                        .ifTrue(new Actions().setValue("mode", "normal").build())
                        .ifFalse(new Actions().setValue("mode", "soft_delete").build())
                        .build()}
                    renderer={(el) => el.mode === "normal"}
                />
            </div>

            {/* Contenu principal - Slots */}
            <div className="flex-1 flex flex-col pb-4">
                <div className="relative w-full flex justify-between items-center">
                    <div className="flex -space-x-1">
                        {flattenedSlots.map((slot, index) => (
                            <div
                                key={`${slot}-${index.toString()}`}
                                className="h-6 w-6 flex items-center justify-center p-1 bg-zinc-800/30 rounded border border-zinc-700/50">
                                <img
                                    src={SLOT_IMAGES[slot as keyof typeof SLOT_IMAGES] || SLOT_IMAGES.any}
                                    alt={slot}
                                    className="h-full pixelated"
                                />
                            </div>
                        ))}

                        {flattenedSlots.length === 0 && (
                            <span className="text-xs text-zinc-500 px-2 py-1 bg-zinc-800/50 rounded border border-zinc-700">
                                <Translate content="enchantment:overview.no_slots" />
                            </span>
                        )}
                    </div>
                    <Popover onOpenChange={handlePopoverChange}>
                        <PopoverTrigger>
                            <span className="text-xs bg-zinc-900/60 border border-zinc-800 px-2 py-2 rounded-lg cursor-pointer hover:bg-zinc-800/60 transition-colors">
                                {flattenedSlots.length > 5
                                    ? `
                                +${flattenedSlots.length - 5} more`
                                    : "Configure Slots"}
                            </span>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="flex flex-col gap-4 min-w-120">
                                <div className="space-y-2 pt-2">
                                    <p className="font-semibold leading-2">
                                        <Translate content="enchantment:slots.tooltip.title" />
                                    </p>
                                    <p className="text-xs text-zinc-400">
                                        <Translate content="enchantment:slots.tooltip.description" />
                                    </p>
                                </div>

                                <hr />

                                <div className="py-2">
                                    <SlotGrid element={element} elementId={elementId} />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Footer - toujours en bas */}
            <div className="pt-4 border-t border-zinc-800/50 mt-auto">
                <Link
                    to="/$lang/studio/editor/enchantment/main"
                    params={{ lang }}
                    onClick={handleConfigure}
                    className="w-full cursor-pointer bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-colors block text-center">
                    <Translate content="configure" />
                </Link>
            </div>

            {/* Background shine */}
            <div className="absolute inset-0 -z-10 brightness-30 group-hover:brightness-70 transition rounded-xl overflow-hidden">
                <img src="/images/shine.avif" alt="Shine" className="w-full h-full object-cover" />
            </div>
        </div>
    );
}

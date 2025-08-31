import { useParams, useRouter } from "@tanstack/react-router";
import { Actions, Identifier } from "@voxelio/breeze";
import type { EnchantmentProps } from "@voxelio/breeze/schema";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { cn } from "@/lib/utils";
import OverviewCase from "@/components/tools/concept/enchantment/EnchantmentOverviewCase";

const findOptions = [
    {
        title: "enchantment:overview.enchanting_table",
        image: "/images/features/block/enchanting_table.webp",
        tag: "#minecraft:in_enchanting_table",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:overview.chest",
        image: "/images/features/block/chest.webp",
        tag: "#minecraft:on_random_loot",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:overview.tradeable",
        image: "/images/features/item/enchanted_book.webp",
        tag: "#minecraft:on_traded_equipment",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:overview.tradeable_equipment",
        image: "/images/features/item/enchanted_item.webp",
        tag: "#minecraft:tradeable",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:overview.price_doubled",
        image: "/images/features/title/doubled.webp",
        tag: "#minecraft:double_trade_price",
        lock_value: "#minecraft:treasure"
    }
];

export default function EnchantOverviewCard(props: {
    element: EnchantmentProps;
    items: string[];
    elementId: string;
    display: "minimal" | "detailed";
}) {
    const router = useRouter();
    const { lang } = useParams({ from: "/$lang" });

    const handleConfigure = () => {
        useConfiguratorStore.getState().setCurrentElementId(props.elementId);
        router.navigate({ to: "/$lang/studio/editor/enchantment/main", params: { lang } });
    };

    return (
        <div
            className={cn(
                "bg-black/50 border-t-2 border-l-2 border-stone-900 select-none relative transition-all hover:ring-1 ring-zinc-900 rounded-xl p-4",
                "flex flex-col"
            )}>
            {/* Header avec switch */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {props.items.length === 0 ? (
                        <div className="w-6 h-6 bg-stone-900 rounded-full animate-pulse flex-shrink-0" />
                    ) : (
                        <div className="flex-shrink-0">
                            <TextureRenderer id={props.items[0]} />
                        </div>
                    )}
                    <div className="flex flex-col gap-1 justify-center">
                        <h3 className="text-sm font-semibold truncate">{new Identifier(props.element.identifier).toResourceName()}</h3>
                        <div className="flex items-center">
                            <div className="bg-zinc-800/20 pr-2 pl-1 py-px rounded-full border border-zinc-800">
                                <div className="flex items-center gap-1">
                                    <img src="/icons/tools/maxLevel.svg" alt="Max Level" className="invert-70 w-3 h-3" />
                                    <span className="text-xs tracking-wider text-zinc-400 font-medium">
                                        <Translate content="enchantment:overview.level" /> {props.element.maxLevel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SimpleSwitch
                    elementId={props.elementId}
                    action={new Actions()
                        .alternative((el) => el.mode === "soft_delete")
                        .ifTrue(new Actions().setValue("mode", "normal").build())
                        .ifFalse(new Actions().setValue("mode", "soft_delete").build())
                        .build()}
                    renderer={(el) => el.mode === "normal"}
                />
            </div>

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col">
                {props.display === "minimal" && (
                    <div className="flex flex-wrap gap-2 py-4 flex-1">
                        {findOptions.map((tag) => (
                            <OverviewCase
                                key={tag.title}
                                title={tag.title}
                                image={tag.image}
                                tag={tag.tag}
                                elementId={props.elementId}
                                action={new Actions().toggleValueInList("tags", tag.tag).build()}
                                renderer={(el: EnchantmentProps) => el.tags.includes(tag.lock_value) || el.tags.includes(tag.tag)}
                            />
                        ))}
                    </div>
                )}

                {/* Footer - toujours en bas */}
                <div className="pt-4 border-t border-zinc-800/50 mt-auto">
                    <button
                        onClick={handleConfigure}
                        onKeyDown={handleConfigure}
                        type="button"
                        className="w-full cursor-pointer bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-colors">
                        <Translate content="configure" />
                    </button>
                </div>
            </div>

            {/* Background shine */}
            <div className="absolute inset-0 -z-10 brightness-30 rounded-xl overflow-hidden">
                <img src="/images/shine.avif" alt="Shine" className="w-full h-full object-cover" />
            </div>
        </div>
    );
}

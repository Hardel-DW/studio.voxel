import { Link, useParams } from "@tanstack/react-router";
import type { EnchantmentProps, TagType } from "@voxelio/breeze";
import { CoreAction, getItemFromMultipleOrOne, Identifier, TagsProcessor } from "@voxelio/breeze";
import OverviewCase from "@/components/tools/concept/enchantment/EnchantmentOverviewCase";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/ui/Translate";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { cn } from "@/lib/utils";

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

export default function EnchantOverviewCard(props: { element: EnchantmentProps; display: boolean }) {
    const { lang } = useParams({ from: "/$lang" });
    const { data } = useRegistry<FetchedRegistry<TagType>>("summary", "tags/item");
    const datapackTags = useConfiguratorStore((state) => state.getRegistry<TagType>("tags/item"));
    const { isTag, id } = getItemFromMultipleOrOne(props.element.supportedItems);
    const elementId = new Identifier(props.element.identifier).toUniqueKey();

    const tagId = Identifier.of(id.startsWith("#") ? id.slice(1) : id, "tags/item");
    const vanillaTags = data
        ? Object.entries(data).map(([key, value]) => ({ identifier: Identifier.of(key, "tags/item"), data: value }))
        : [];
    const merge = TagsProcessor.merge([
        { id: "vanilla", tags: vanillaTags },
        { id: "datapack", tags: datapackTags }
    ]);
    const items = isTag && merge.length > 0 ? new TagsProcessor(merge).getRecursiveValues(tagId) : [id];

    const handleConfigure = () => useConfiguratorStore.getState().setCurrentElementId(elementId);

    return (
        <div
            className={cn(
                "bg-black/50 border-t-2 border-l-2 shadow-xl shadow-black/30 border-stone-900 select-none relative transition-all hover:ring-2 ring-zinc-900 rounded-xl p-4 h-full group",
                "flex flex-col"
            )}>
            {/* Header avec switch */}
            <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {items.length === 0 ? (
                        <div className="w-6 h-6 bg-stone-900 rounded-full animate-pulse shrink-0" />
                    ) : (
                        <div className="shrink-0">
                            <TextureRenderer id={items[0]} />
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
                    elementId={elementId}
                    action={CoreAction.setValue("mode", props.element.mode === "soft_delete" ? "normal" : "soft_delete")}
                    renderer={(el) => el.mode === "normal"}
                />
            </div>

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col">
                {!props.display && (
                    <div className="flex flex-wrap gap-2 pb-4 flex-1">
                        {findOptions.map((tag) => (
                            <OverviewCase
                                key={tag.title}
                                title={tag.title}
                                image={tag.image}
                                tag={tag.tag}
                                elementId={elementId}
                                action={CoreAction.toggleValueInList("tags", tag.tag)}
                                renderer={(el: EnchantmentProps) => el.tags.includes(tag.lock_value) || el.tags.includes(tag.tag)}
                            />
                        ))}
                    </div>
                )}

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
            </div>

            {/* Background shine */}
            <div className="absolute inset-0 -z-10 brightness-30 group-hover:brightness-70 transition rounded-xl overflow-hidden">
                <img src="/images/shine.avif" alt="Shine" className="w-full h-full object-cover" />
            </div>
        </div>
    );
}

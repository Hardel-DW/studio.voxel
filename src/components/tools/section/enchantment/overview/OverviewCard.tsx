import Counter from "@/components/ui/Counter";
import { cn } from "@/lib/utils";
import { Identifier } from "@voxelio/breeze";
import { Actions } from "@voxelio/breeze/core";
import type { EnchantmentProps } from "@voxelio/breeze/schema";
import { LockEntryBuilder } from "@/lib/utils/lock";
import TagsRenderer from "@/components/tools/texture/TagsRenderer";
import OverviewCase from "./OverviewCase";

const findOptions = [
    {
        title: "tools.enchantments.section.find.components.enchantingTable.title",
        image: "/images/features/block/enchanting_table.webp",
        tag: "#minecraft:in_enchanting_table",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "tools.enchantments.section.find.components.mobEquipment.title",
        image: "/images/features/entity/zombie.webp",
        tag: "#minecraft:on_mob_spawn_equipment",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "tools.enchantments.section.find.components.lootInChests.title",
        image: "/images/features/block/chest.webp",
        tag: "#minecraft:on_random_loot",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "tools.enchantments.section.find.components.tradeable.title",
        image: "/images/features/item/enchanted_book.webp",
        tag: "#minecraft:on_traded_equipment",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "tools.enchantments.section.find.components.tradeableEquipment.title",
        image: "/images/features/item/enchanted_item.webp",
        tag: "#minecraft:tradeable",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "tools.enchantments.section.find.components.priceDoubled.title",
        image: "/images/features/title/doubled.webp",
        tag: "#minecraft:double_trade_price",
        lock_value: "#minecraft:treasure"
    }
];

export default function OverviewCard(props: {
    element: EnchantmentProps;
    items: string[];
    elementId: string;
    display: "minimal" | "detailed";
}) {
    return (
        <div
            className={cn(
                "bg-black/50 border-t-2 border-l-2 border-stone-900 select-none relative transition-all hover:ring-1 ring-zinc-900 p-6 rounded-xl"
            )}>
            <div className="flex justify-between items-center h-fit">
                <div className="text-start items-center flex gap-4">
                    {props.items.length === 0 ? (
                        <div className="w-4 h-4 bg-stone-900 rounded-full animate-pulse" />
                    ) : (
                        <TagsRenderer items={props.items} />
                    )}
                    <h3 className="text-lg font-semibold">{new Identifier(props.element.identifier).toResourceName()}</h3>
                </div>

                <div className="flex items-center gap-2">
                    <Counter value={props.element.maxLevel} min={0} max={12} step={1} onChange={() => {}} disabled={false} />
                    <img src="/icons/tools/maxLevel.svg" alt="Max Level" className="invert bg-contain" />
                </div>
            </div>

            {/* Grid of find options - 3x2 */}
            {props.display === "detailed" && (
                <div className="mt-8">
                    <div className="grid gap-2 items-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}>
                        {findOptions.map((option) => (
                            <OverviewCase
                                key={option.title}
                                title={option.title}
                                image={option.image}
                                action={new Actions().toggleValueInList("tags", option.tag).build()}
                                renderer={(el: EnchantmentProps) => el.tags.includes(option.tag)}
                                lock={[
                                    new LockEntryBuilder()
                                        .addTextKey("tools.enchantments.section.technical.components.reason")
                                        .addCondition((el: EnchantmentProps) => el.tags.includes(option.lock_value))
                                        .build(),
                                    new LockEntryBuilder()
                                        .addTextKey("tools.disabled_because_vanilla")
                                        .addCondition((el: EnchantmentProps) => el.identifier?.namespace === "minecraft")
                                        .build()
                                ]}
                                elementId={props.elementId}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}

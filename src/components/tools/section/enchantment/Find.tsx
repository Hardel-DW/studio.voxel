import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import ToolReveal, { ToolRevealElement } from "@/components/tools/elements/schema/reveal/ToolReveal";
import Loader from "@/components/ui/Loader";
import { Actions } from "@voxelio/breeze/core";
import type { EnchantmentProps } from "@voxelio/breeze/schema";
import { isMinecraft, LockEntryBuilder } from "@/lib/utils/lock";
import React, { lazy, Suspense } from "react";

// Lazy load the addon components
const LazyEnchantDNT = lazy(() => import("./FindDnt"));
const LazyEnchantYggdrasil = lazy(() => import("./FindYggdrasil"));

const iterationValues = [
    {
        title: "tools.enchantments.section.find.components.enchantingTable.title",
        description: "tools.enchantments.section.find.components.enchantingTable.description",
        image: "/images/features/block/enchanting_table.webp",
        tag: "#minecraft:in_enchanting_table",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "tools.enchantments.section.find.components.mobEquipment.title",
        description: "tools.enchantments.section.find.components.mobEquipment.description",
        image: "/images/features/entity/zombie.webp",
        tag: "#minecraft:on_mob_spawn_equipment",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "tools.enchantments.section.find.components.lootInChests.title",
        description: "tools.enchantments.section.find.components.lootInChests.description",
        image: "/images/features/block/chest.webp",
        tag: "#minecraft:on_random_loot",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "tools.enchantments.section.find.components.tradeable.title",
        description: "tools.enchantments.section.find.components.tradeable.description",
        image: "/images/features/item/enchanted_book.webp",
        tag: "#minecraft:on_traded_equipment",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "tools.enchantments.section.find.components.tradeableEquipment.title",
        description: "tools.enchantments.section.find.components.tradeableEquipment.description",
        image: "/images/features/item/enchanted_item.webp",
        tag: "#minecraft:tradeable",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "tools.enchantments.section.find.components.priceDoubled.title",
        description: "tools.enchantments.section.find.components.priceDoubled.description",
        image: "/images/features/title/doubled.webp",
        tag: "#minecraft:double_trade_price",
        lock_value: "#minecraft:treasure"
    }
];

export default function EnchantFindBehaviourSection() {
    return (
        <>
            <ToolSection id="behaviour" title={{ key: "tools.enchantments.section.find" }}>
                <ToolGrid size="350px">
                    {iterationValues.map((value) => (
                        <ToolSlot
                            align="left"
                            key={value.tag}
                            action={new Actions().toggleValueInList("tags", value.tag).build()}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value.tag)}
                            lock={[
                                new LockEntryBuilder()
                                    .addTextKey("tools.enchantments.section.technical.components.reason")
                                    .addCondition((el: EnchantmentProps) => el.tags.includes(value.lock_value))
                                    .build(),
                                isMinecraft
                            ]}
                            title={{ key: value.title }}
                            image={value.image}
                            description={{ key: value.description }}
                        />
                    ))}
                </ToolGrid>
            </ToolSection>
            <ToolSection id="addons" title={{ key: "tools.enchantments.section.addons.description" }}>
                <ToolReveal defaultValue="dnt">
                    <ToolRevealElement
                        id="dnt"
                        logo="/images/addons/logo/dnt.webp"
                        image="/images/addons/hero/dnt.png"
                        href="https://modrinth.com/datapack/dungeons-and-taverns"
                        title={{ key: "tools.enchantments.section.addons.dnt.title" }}
                        description={{ key: "tools.enchantments.section.addons.dnt.description" }}>
                        <Suspense fallback={<Loader />}>
                            <LazyEnchantDNT />
                        </Suspense>
                    </ToolRevealElement>
                    <ToolRevealElement
                        id="yggdrasil"
                        logo="/images/addons/logo/yggdrasil.webp"
                        image="/images/addons/hero/yggdrasil.png"
                        href="https://modrinth.com/datapack/yggdrasil-structure"
                        title={{ key: "tools.enchantments.section.addons.yggdrasil.title" }}
                        description={{ key: "tools.enchantments.section.addons.yggdrasil.description" }}>
                        <Suspense fallback={<Loader />}>
                            <LazyEnchantYggdrasil />
                        </Suspense>
                    </ToolRevealElement>
                </ToolReveal>
            </ToolSection>
        </>
    );
}

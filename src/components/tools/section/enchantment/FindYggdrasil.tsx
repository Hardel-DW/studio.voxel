import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolInline from "@/components/tools/elements/ToolInline";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import { Actions } from "@voxelio/breeze/core";
import type { EnchantmentProps } from "@voxelio/breeze/schema";
import React from "react";

// Structure data for Alfheim section
const alfheimStructures = [
    {
        title: "tools.enchantments.section.addons.yggdrasil.random_chest.title",
        description: "tools.enchantments.section.addons.yggdrasil.random_chest.description",
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/alfheim_tree/random_loot"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.vault.title",
        description: "tools.enchantments.section.addons.yggdrasil.vault.description",
        image: "/images/features/block/vault.webp",
        tag: "#yggdrasil:structure/alfheim_tree/vault"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.ominous_vault.title",
        description: "tools.enchantments.section.addons.yggdrasil.ominous_vault.description",
        image: "/images/features/block/ominous_vault.webp",
        tag: "#yggdrasil:structure/alfheim_tree/ominous_vault"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.trial_spawner.title",
        description: "tools.enchantments.section.addons.yggdrasil.trial_spawner.description",
        image: "/images/features/block/trial_spawner.webp",
        tag: "#yggdrasil:structure/alfheim_tree/trial_spawner"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.ominous_trial_spawner.title",
        description: "tools.enchantments.section.addons.yggdrasil.ominous_trial_spawner.description",
        image: "/images/features/block/ominous_trial_spawner.webp",
        tag: "#yggdrasil:structure/alfheim_tree/ominous_trial_spawner"
    }
];

// Structure data for Asflors section
const asflorsStructures = [
    {
        title: "tools.enchantments.section.addons.yggdrasil.common_chest.title",
        description: "tools.enchantments.section.addons.yggdrasil.common_chest.description",
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/asflors/common"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.structure_vault.title",
        description: "tools.enchantments.section.addons.yggdrasil.structure_vault.description",
        image: "/images/features/block/vault.webp",
        tag: "#yggdrasil:structure/asflors/vault"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.structure_ominous_vault.title",
        description: "tools.enchantments.section.addons.yggdrasil.structure_ominous_vault.description",
        image: "/images/features/block/ominous_vault.webp",
        tag: "#yggdrasil:structure/asflors/ominous_vault"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.asflors_sword.title",
        description: "tools.enchantments.section.addons.yggdrasil.asflors_sword.description",
        image: "/images/features/item/sword.webp",
        tag: "#yggdrasil:structure/asflors/asflors_sword"
    }
];

// Structure data for Runic Labyrinth section
const runicLabyrinthStructures = [
    {
        title: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.dark_elven_bow.title",
        description: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.dark_elven_bow.description",
        image: "/images/features/item/bow.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/dark_elven_bow"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.twilight_bow.title",
        description: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.twilight_bow.description",
        image: "/images/features/item/bow.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/twilight_of_yggdrasil_bow"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.library.title",
        description: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.library.description",
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/library"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.random.title",
        description: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.random.description",
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/random"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.shulker.title",
        description: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.shulker.description",
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/shulker"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.trial.title",
        description: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.trial.description",
        image: "/images/features/block/trial_spawner.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/trial"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.vault.title",
        description: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.vault.description",
        image: "/images/features/block/vault.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/vault"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.ominous_trial.title",
        description: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.ominous_trial.description",
        image: "/images/features/block/ominous_trial_spawner.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/ominous_trial"
    },
    {
        title: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.ominous_vault.title",
        description: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.ominous_vault.description",
        image: "/images/features/block/ominous_vault.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/ominous_vault"
    }
];

// Equipment tags for Yggdrasil
const yggdrasilEquipmentTags = [
    "#yggdrasil:equipment/item/bow",
    "#yggdrasil:equipment/item/sword",
    "#yggdrasil:equipment/item/helmet",
    "#yggdrasil:equipment/item/chestplate",
    "#yggdrasil:equipment/item/leggings",
    "#yggdrasil:equipment/item/boots"
];

export default function EnchantYggdrasil() {
    return (
        <>
            {/* Alfheim Category */}
            <ToolCategory title={{ key: "tools.enchantments.section.addons.yggdrasil.alfheim.title" }}>
                <ToolGrid size="400px">
                    <ToolSlot
                        image="/images/features/title/yg.webp"
                        title={{ key: "tools.enchantments.section.yggdrasil.components.yggdrasilMobEquipment.title" }}
                        description={{ key: "tools.enchantments.section.yggdrasil.components.yggdrasilMobEquipment.description" }}
                        action={new Actions().toggleAllValuesInList("tags", yggdrasilEquipmentTags).build()}
                        renderer={(el: EnchantmentProps) => yggdrasilEquipmentTags.some((tag) => el.tags.includes(tag))}
                    />

                    {alfheimStructures.map((structure) => (
                        <ToolSlot
                            key={structure.tag}
                            title={{ key: structure.title }}
                            description={{ key: structure.description }}
                            image={structure.image}
                            action={new Actions().toggleValueInList("tags", structure.tag).build()}
                            renderer={(el: EnchantmentProps) => el.tags.includes(structure.tag)}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>

            {/* Asflors Category */}
            <ToolCategory title={{ key: "tools.enchantments.section.addons.yggdrasil.asflors.title" }}>
                <ToolGrid size="300px">
                    {asflorsStructures.map((structure) => (
                        <ToolSlot
                            key={structure.tag}
                            title={{ key: structure.title }}
                            description={{ key: structure.description }}
                            image={structure.image}
                            action={new Actions().toggleValue("tags", structure.tag).build()}
                            renderer={(el: EnchantmentProps) => el.tags.includes(structure.tag)}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>

            {/* Runic Fracture Category */}
            <ToolCategory title={{ key: "tools.enchantments.section.addons.yggdrasil.runic_fracture.title" }}>
                <ToolGrid size="400px">
                    <ToolSlot
                        title={{ key: "tools.enchantments.section.addons.yggdrasil.boss_trial_spawner.title" }}
                        description={{ key: "tools.enchantments.section.addons.yggdrasil.boss_trial_spawner.description" }}
                        image="/images/features/block/ominous_trial_spawner.webp"
                        action={new Actions().toggleValue("tags", "#yggdrasil:structure/runic_fracture/boss_trial_spawner").build()}
                        renderer={(el: EnchantmentProps) => el.tags.includes("#yggdrasil:structure/runic_fracture/boss_trial_spawner")}
                    />
                    <ToolSlot
                        title={{ key: "tools.enchantments.section.addons.yggdrasil.monster_trial_spawner.title" }}
                        description={{ key: "tools.enchantments.section.addons.yggdrasil.monster_trial_spawner.description" }}
                        image="/images/features/block/ominous_trial_spawner.webp"
                        action={new Actions().toggleValue("tags", "#yggdrasil:structure/runic_fracture/monster_trial_spawner").build()}
                        renderer={(el: EnchantmentProps) => el.tags.includes("#yggdrasil:structure/runic_fracture/monster_trial_spawner")}
                    />
                </ToolGrid>
            </ToolCategory>

            {/* Runic Labyrinth Category */}
            <ToolCategory title={{ key: "tools.enchantments.section.addons.yggdrasil.runic_labyrinth.title" }}>
                <ToolGrid size="400px">
                    {runicLabyrinthStructures.map((structure) => (
                        <ToolInline
                            key={structure.tag}
                            title={{ key: structure.title }}
                            description={{ key: structure.description }}
                            image={structure.image}
                            action={new Actions().toggleValue("tags", structure.tag).build()}
                            renderer={(el: EnchantmentProps) => el.tags.includes(structure.tag)}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>
        </>
    );
}

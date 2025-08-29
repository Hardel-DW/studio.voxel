import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolInline from "@/components/tools/elements/ToolInline";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import { Actions } from "@voxelio/breeze/core";
import type { EnchantmentProps } from "@voxelio/breeze/schema";

// Structure data for Alfheim section
const alfheimStructures = [
    {
        title: "yggdrasil:random_chest.title",
        description: "yggdrasil:random_chest.description",
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/alfheim_tree/random_loot"
    },
    {
        title: "yggdrasil:vault.title",
        description: "yggdrasil:vault.description",
        image: "/images/features/block/vault.webp",
        tag: "#yggdrasil:structure/alfheim_tree/vault"
    },
    {
        title: "yggdrasil:ominous_vault.title",
        description: "yggdrasil:ominous_vault.description",
        image: "/images/features/block/ominous_vault.webp",
        tag: "#yggdrasil:structure/alfheim_tree/ominous_vault"
    },
    {
        title: "yggdrasil:trial_spawner.title",
        description: "yggdrasil:trial_spawner.description",
        image: "/images/features/block/trial_spawner.webp",
        tag: "#yggdrasil:structure/alfheim_tree/trial_spawner"
    },
    {
        title: "yggdrasil:ominous_trial_spawner.title",
        description: "yggdrasil:ominous_trial_spawner.description",
        image: "/images/features/block/ominous_trial_spawner.webp",
        tag: "#yggdrasil:structure/alfheim_tree/ominous_trial_spawner"
    }
];

// Structure data for Asflors section
const asflorsStructures = [
    {
        title: "yggdrasil:common_chest.title",
        description: "yggdrasil:common_chest.description",
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/asflors/common"
    },
    {
        title: "yggdrasil:structure_vault.title",
        description: "yggdrasil:structure_vault.description",
        image: "/images/features/block/vault.webp",
        tag: "#yggdrasil:structure/asflors/vault"
    },
    {
        title: "yggdrasil:structure_ominous_vault.title",
        description: "yggdrasil:structure_ominous_vault.description",
        image: "/images/features/block/ominous_vault.webp",
        tag: "#yggdrasil:structure/asflors/ominous_vault"
    },
    {
        title: "yggdrasil:asflors_sword.title",
        description: "yggdrasil:asflors_sword.description",
        image: "/images/features/item/sword.webp",
        tag: "#yggdrasil:structure/asflors/asflors_sword"
    }
];

// Structure data for Runic Labyrinth section
const runicLabyrinthStructures = [
    {
        title: "yggdrasil:runic_laby.dark_elven_bow.title",
        description: "yggdrasil:runic_laby.dark_elven_bow.description",
        image: "/images/features/item/bow.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/dark_elven_bow"
    },
    {
        title: "yggdrasil:runic_laby.twilight_bow.title",
        description: "yggdrasil:runic_laby.twilight_bow.description",
        image: "/images/features/item/bow.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/twilight_of_yggdrasil_bow"
    },
    {
        title: "yggdrasil:runic_laby.library.title",
        description: "yggdrasil:runic_laby.library.description",
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/library"
    },
    {
        title: "yggdrasil:runic_laby.random.title",
        description: "yggdrasil:runic_laby.random.description",
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/random"
    },
    {
        title: "yggdrasil:runic_laby.shulker.title",
        description: "yggdrasil:runic_laby.shulker.description",
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/shulker"
    },
    {
        title: "yggdrasil:runic_laby.trial.title",
        description: "yggdrasil:runic_laby.trial.description",
        image: "/images/features/block/trial_spawner.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/trial"
    },
    {
        title: "yggdrasil:runic_laby.vault.title",
        description: "yggdrasil:runic_laby.vault.description",
        image: "/images/features/block/vault.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/vault"
    },
    {
        title: "yggdrasil:runic_laby.ominous_trial.title",
        description: "yggdrasil:runic_laby.ominous_trial.description",
        image: "/images/features/block/ominous_trial_spawner.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/ominous_trial"
    },
    {
        title: "yggdrasil:runic_laby.ominous_vault.title",
        description: "yggdrasil:runic_laby.ominous_vault.description",
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
            <ToolCategory title={{ key: "yggdrasil:alfheim.title" }}>
                <ToolGrid size="400px">
                    <ToolSlot
                        image="/images/features/title/yg.webp"
                        title={{ key: "yggdrasil:yggdrasil_mob_equipment.title" }}
                        description={{ key: "yggdrasil:yggdrasil_mob_equipment.description" }}
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
            <ToolCategory title={{ key: "yggdrasil:asflors.title" }}>
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
            <ToolCategory title={{ key: "yggdrasil:runic_fracture.title" }}>
                <ToolGrid size="400px">
                    <ToolSlot
                        title={{ key: "yggdrasil:boss_trial_spawner.title" }}
                        description={{ key: "yggdrasil:boss_trial_spawner.description" }}
                        image="/images/features/block/ominous_trial_spawner.webp"
                        action={new Actions().toggleValue("tags", "#yggdrasil:structure/runic_fracture/boss_trial_spawner").build()}
                        renderer={(el: EnchantmentProps) => el.tags.includes("#yggdrasil:structure/runic_fracture/boss_trial_spawner")}
                    />
                    <ToolSlot
                        title={{ key: "yggdrasil:monster_trial_spawner.title" }}
                        description={{ key: "yggdrasil:monster_trial_spawner.description" }}
                        image="/images/features/block/ominous_trial_spawner.webp"
                        action={new Actions().toggleValue("tags", "#yggdrasil:structure/runic_fracture/monster_trial_spawner").build()}
                        renderer={(el: EnchantmentProps) => el.tags.includes("#yggdrasil:structure/runic_fracture/monster_trial_spawner")}
                    />
                </ToolGrid>
            </ToolCategory>

            {/* Runic Labyrinth Category */}
            <ToolCategory title={{ key: "yggdrasil:runic_laby.title" }}>
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

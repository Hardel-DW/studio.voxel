import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction } from "@voxelio/breeze";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolInline from "@/components/tools/elements/ToolInline";
import ToolSlot from "@/components/tools/elements/ToolSlot";

const alfheim = {
    random_chest: {
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/alfheim_tree/random_loot"
    },
    vault: {
        image: "/images/features/block/vault.webp",
        tag: "#yggdrasil:structure/alfheim_tree/vault"
    },
    ominous_vault: {
        image: "/images/features/block/ominous_vault.webp",
        tag: "#yggdrasil:structure/alfheim_tree/ominous_vault"
    },
    trial_spawner: {
        image: "/images/features/block/trial_spawner.webp",
        tag: "#yggdrasil:structure/alfheim_tree/trial_spawner"
    },
    ominous_trial_spawner: {
        image: "/images/features/block/ominous_trial_spawner.webp",
        tag: "#yggdrasil:structure/alfheim_tree/ominous_trial_spawner"
    }
};

const asflors = {
    common_chest: {
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/asflors/common"
    },
    structure_vault: {
        image: "/images/features/block/vault.webp",
        tag: "#yggdrasil:structure/asflors/vault"
    },
    structure_ominous_vault: {
        image: "/images/features/block/ominous_vault.webp",
        tag: "#yggdrasil:structure/asflors/ominous_vault"
    },
    asflors_sword: {
        image: "/images/features/item/sword.webp",
        tag: "#yggdrasil:structure/asflors/asflors_sword"
    }
};

const runic = {
    dark_elven_bow: {
        image: "/images/features/item/bow.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/dark_elven_bow"
    },
    twilight_bow: {
        image: "/images/features/item/bow.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/twilight_of_yggdrasil_bow"
    },
    library: {
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/library"
    },
    random: {
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/random"
    },
    shulker: {
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/shulker"
    },
    trial: {
        image: "/images/features/block/trial_spawner.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/trial"
    },
    vault: {
        image: "/images/features/block/vault.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/vault"
    },
    ominous_trial: {
        image: "/images/features/block/ominous_trial_spawner.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/ominous_trial"
    },
    ominous_vault: {
        image: "/images/features/block/ominous_vault.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/ominous_vault"
    }
};

const runicFracture = {
    boss_trial_spawner: {
        image: "/images/features/block/ominous_trial_spawner.webp",
        tag: "#yggdrasil:structure/runic_fracture/boss_trial_spawner"
    },
    monster_trial_spawner: {
        image: "/images/features/block/ominous_trial_spawner.webp",
        tag: "#yggdrasil:structure/runic_fracture/monster_trial_spawner"
    }
};

const yggdrasilEquipmentTags = [
    "#yggdrasil:equipment/item/bow",
    "#yggdrasil:equipment/item/sword",
    "#yggdrasil:equipment/item/helmet",
    "#yggdrasil:equipment/item/chestplate",
    "#yggdrasil:equipment/item/leggings",
    "#yggdrasil:equipment/item/boots"
];

export default function EnchantYggdrasilSection() {
    return (
        <>
            <ToolCategory title="yggdrasil:alfheim.title">
                <ToolGrid size="400px">
                    <ToolSlot
                        image="/images/features/title/yg.webp"
                        title="yggdrasil:yggdrasil_mob_equipment.title"
                        description="yggdrasil:yggdrasil_mob_equipment.description"
                        action={CoreAction.toggleAllValuesInList("tags", yggdrasilEquipmentTags)}
                        renderer={(el: EnchantmentProps) => yggdrasilEquipmentTags.some((tag) => el.tags.includes(tag))}
                    />

                    {Object.entries(alfheim).map(([key, value]) => (
                        <ToolSlot
                            key={value.tag}
                            title={`yggdrasil:${key}.title`}
                            description={`yggdrasil:${key}.description`}
                            image={value.image}
                            action={CoreAction.toggleValue("tags", value.tag)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value.tag)}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>

            <ToolCategory title="yggdrasil:asflors.title">
                <ToolGrid size="300px">
                    {Object.entries(asflors).map(([key, value]) => (
                        <ToolSlot
                            key={value.tag}
                            title={`yggdrasil:${key}.title`}
                            description={`yggdrasil:${key}.description`}
                            image={value.image}
                            action={CoreAction.toggleValue("tags", value.tag)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value.tag)}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>

            <ToolCategory title="yggdrasil:runic_fracture.title">
                <ToolGrid size="400px">
                    {Object.entries(runicFracture).map(([key, value]) => (
                        <ToolSlot
                            key={value.tag}
                            title={`yggdrasil:${key}.title`}
                            description={`yggdrasil:${key}.description`}
                            image={value.image}
                            action={CoreAction.toggleValue("tags", value.tag)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value.tag)}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>

            <ToolCategory title="yggdrasil:runic_laby.title">
                <ToolGrid size="400px">
                    {Object.entries(runic).map(([key, value]) => (
                        <ToolInline
                            key={value.tag}
                            title={`yggdrasil:runic_laby.${key}.title`}
                            description={`yggdrasil:runic_laby.${key}.description`}
                            image={value.image}
                            action={CoreAction.toggleValue("tags", value.tag)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value.tag)}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>
        </>
    );
}

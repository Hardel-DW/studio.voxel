import { Identifier } from "@voxelio/breeze";

const definitions = {
    sword: "#minecraft:enchantable/sword",
    trident: "#minecraft:enchantable/trident",
    mace: "#minecraft:enchantable/mace",
    bow: "#minecraft:enchantable/bow",
    crossbow: "#minecraft:enchantable/crossbow",
    range: "#voxel:enchantable/range",
    fishing: "#minecraft:enchantable/fishing",
    shield: "#voxel:enchantable/shield",
    weapon: "#minecraft:enchantable/weapon",
    melee: "#voxel:enchantable/melee",
    head_armor: "#minecraft:enchantable/head_armor",
    chest_armor: "#minecraft:enchantable/chest_armor",
    leg_armor: "#minecraft:enchantable/leg_armor",
    foot_armor: "#minecraft:enchantable/foot_armor",
    elytra: "#voxel:enchantable/elytra",
    armor: "#minecraft:enchantable/armor",
    equippable: "#minecraft:enchantable/equippable",
    axes: "#voxel:enchantable/axes",
    shovels: "#voxel:enchantable/shovels",
    hoes: "#voxel:enchantable/hoes",
    pickaxes: "#voxel:enchantable/pickaxes",
    durability: "#minecraft:enchantable/durability",
    mining_loot: "#minecraft:enchantable/mining_loot"
} as const;

export const enchantableItems = Object.fromEntries(
    Object.entries(definitions).map(([key, id]) => [key, Identifier.of(id, "tags/item")])
) as Record<keyof typeof definitions, Identifier>;

export const enchantableKeys = Object.keys(definitions) as Array<keyof typeof definitions>;
export const enchantableEntries = Object.entries(enchantableItems) as Array<[keyof typeof definitions, Identifier]>;

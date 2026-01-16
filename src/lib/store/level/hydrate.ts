import type { NbtFile, NbtTag } from "@voxelio/snbt";
import { isByte, isCompound, isInt, isList, isLong, isString } from "@voxelio/snbt";
import type { DimensionData, LevelData } from "../LevelStore";

export const hydrateLevelData = (file: NbtFile): LevelData => {
    const data = file.getCompound("Data");

    return {
        levelName: extractString(data, "LevelName", "Unknown World"),
        version: extractVersion(data),
        lastPlayed: extractLong(data, "LastPlayed"),
        gameType: extractInt(data, "GameType"),
        difficulty: extractByte(data, "Difficulty", 2),
        difficultyLocked: extractByte(data, "DifficultyLocked") === 1,
        time: extractLong(data, "Time"),
        raining: extractByte(data, "raining") === 1,
        thundering: extractByte(data, "thundering") === 1,
        dimensions: extractDimensions(data),
        enabledPacks: extractPackList(data, "Enabled"),
        disabledPacks: extractPackList(data, "Disabled"),
        dragonKilled: extractDragonByte(data, "DragonKilled"),
        previouslyKilled: extractDragonByte(data, "PreviouslyKilled"),
        gateways: extractGateways(data)
    };
};

const extractString = (data: { entries: Map<string, NbtTag> } | undefined, key: string, fallback = ""): string => {
    const tag = data?.entries.get(key) as NbtTag | undefined;
    return tag && isString(tag) ? tag.value : fallback;
};

const extractInt = (data: { entries: Map<string, NbtTag> } | undefined, key: string, fallback = 0): number => {
    const tag = data?.entries.get(key) as NbtTag | undefined;
    return tag && isInt(tag) ? tag.value : fallback;
};

const extractByte = (data: { entries: Map<string, NbtTag> } | undefined, key: string, fallback = 0): number => {
    const tag = data?.entries.get(key) as NbtTag | undefined;
    return tag && isByte(tag) ? tag.value : fallback;
};

const extractLong = (data: { entries: Map<string, NbtTag> } | undefined, key: string): number => {
    const tag = data?.entries.get(key) as NbtTag | undefined;
    return tag && isLong(tag) ? Number(tag.value) : 0;
};

const extractVersion = (data: { entries: Map<string, NbtTag> } | undefined): { name: string; id: number } => {
    const tag = data?.entries.get("Version") as NbtTag | undefined;
    if (!tag || !isCompound(tag)) return { name: "Unknown", id: 0 };

    const nameTag = tag.entries.get("Name") as NbtTag | undefined;
    const idTag = tag.entries.get("Id") as NbtTag | undefined;

    return {
        name: nameTag && isString(nameTag) ? nameTag.value : "Unknown",
        id: idTag && isInt(idTag) ? idTag.value : 0
    };
};

const extractDimensions = (data: { entries: Map<string, NbtTag> } | undefined): DimensionData[] => {
    const worldGen = data?.entries.get("WorldGenSettings") as NbtTag | undefined;
    if (!worldGen || !isCompound(worldGen)) return [];

    const dims = worldGen.entries.get("dimensions") as NbtTag | undefined;
    if (!dims || !isCompound(dims)) return [];

    const result: DimensionData[] = [];
    for (const [id, value] of dims.entries) {
        if (!isCompound(value)) continue;

        const typeTag = value.entries.get("type") as NbtTag | undefined;
        const type = typeTag && isString(typeTag) ? typeTag.value : "unknown";

        const generator = value.entries.get("generator") as NbtTag | undefined;
        let generatorType = "unknown";
        if (generator && isCompound(generator)) {
            const genTypeTag = generator.entries.get("type") as NbtTag | undefined;
            if (genTypeTag && isString(genTypeTag)) {
                generatorType = genTypeTag.value.replace("minecraft:", "");
            }
        }

        result.push({ id, type, generatorType });
    }

    return result;
};

const extractPackList = (data: { entries: Map<string, NbtTag> } | undefined, key: string): string[] => {
    const dataPacks = data?.entries.get("DataPacks") as NbtTag | undefined;
    if (!dataPacks || !isCompound(dataPacks)) return [];

    const list = dataPacks.entries.get(key) as NbtTag | undefined;
    if (!list || !isList(list)) return [];

    const result: string[] = [];
    for (const item of list.items) {
        if (isString(item)) result.push(item.value);
    }
    return result;
};

const extractDragonByte = (data: { entries: Map<string, NbtTag> } | undefined, key: string): boolean => {
    const dragonFight = data?.entries.get("DragonFight") as NbtTag | undefined;
    if (!dragonFight || !isCompound(dragonFight)) return false;

    const tag = dragonFight.entries.get(key) as NbtTag | undefined;
    return tag && isByte(tag) ? tag.value === 1 : false;
};

const extractGateways = (data: { entries: Map<string, NbtTag> } | undefined): number[] => {
    const dragonFight = data?.entries.get("DragonFight") as NbtTag | undefined;
    if (!dragonFight || !isCompound(dragonFight)) return [];

    const gateways = dragonFight.entries.get("Gateways") as NbtTag | undefined;
    if (!gateways || !isList(gateways)) return [];

    const result: number[] = [];
    for (const item of gateways.items) {
        if (isInt(item)) result.push(item.value);
    }
    return result;
};

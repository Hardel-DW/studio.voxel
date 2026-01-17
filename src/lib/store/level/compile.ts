import { isCompound, type NbtCompound, NbtFile, type NbtTag, nbt } from "@voxelio/snbt";
import type { LevelData } from "../LevelStore";

export const compileLevelData = (original: NbtFile, data: LevelData): Uint8Array => {
    const cloned = cloneNbtFile(original);
    const root = cloned.getCompound("Data");
    if (!root) return cloned.write();

    applyBasicFields(root, data);
    applyDataPacks(root, data);
    applyDragonFight(root, data);
    applyDimensions(root, data);

    return cloned.write();
};

const applyBasicFields = (root: NbtCompound, data: LevelData): void => {
    root.entries.set("LevelName", nbt.string(data.levelName));
    root.entries.set("GameType", nbt.int(data.gameType));
    root.entries.set("Difficulty", nbt.byte(data.difficulty));
    root.entries.set("DifficultyLocked", nbt.byte(data.difficultyLocked ? 1 : 0));
    root.entries.set("Time", nbt.long(BigInt(data.time)));
    root.entries.set("raining", nbt.byte(data.raining ? 1 : 0));
    root.entries.set("thundering", nbt.byte(data.thundering ? 1 : 0));
};

const applyDataPacks = (root: NbtCompound, data: LevelData): void => {
    const dataPacks = root.entries.get("DataPacks") as NbtTag | undefined;
    if (!dataPacks || !isCompound(dataPacks)) return;

    dataPacks.entries.set("Enabled", nbt.list(data.enabledPacks.map(nbt.string)));
    dataPacks.entries.set("Disabled", nbt.list(data.disabledPacks.map(nbt.string)));
};

const applyDragonFight = (root: NbtCompound, data: LevelData): void => {
    const dragonFight = root.entries.get("DragonFight") as NbtTag | undefined;
    if (!dragonFight || !isCompound(dragonFight)) return;

    dragonFight.entries.set("DragonKilled", nbt.byte(data.dragonKilled ? 1 : 0));
    dragonFight.entries.set("PreviouslyKilled", nbt.byte(data.previouslyKilled ? 1 : 0));

    // NBT stores gateways that HAVEN'T spawned, data.gateways contains spawned ones
    const spawnedSet = new Set(data.gateways);
    const notSpawned: number[] = [];
    for (let i = 0; i < 20; i++) {
        if (!spawnedSet.has(i)) notSpawned.push(i);
    }
    dragonFight.entries.set("Gateways", nbt.intArray(notSpawned));
};

const applyDimensions = (root: NbtCompound, data: LevelData): void => {
    const worldGen = root.entries.get("WorldGenSettings") as NbtTag | undefined;
    if (!worldGen || !isCompound(worldGen)) return;

    const dims = worldGen.entries.get("dimensions") as NbtTag | undefined;
    if (!dims || !isCompound(dims)) return;

    const currentIds = new Set(data.dimensions.map((d) => d.id));
    for (const key of dims.entries.keys()) {
        if (!currentIds.has(key)) {
            dims.entries.delete(key);
        }
    }
};

const cloneNbtFile = (file: NbtFile): NbtFile => {
    const bytes = file.write();
    return NbtFile.read(bytes);
};

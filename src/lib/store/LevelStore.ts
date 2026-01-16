import { NbtFile } from "@voxelio/snbt";
import { create } from "zustand";
import { hydrateLevelData } from "./level/hydrate";
import { compileLevelData } from "./level/compile";

export interface DimensionData {
    id: string;
    type: string;
    generatorType: string;
}

export interface LevelData {
    levelName: string;
    version: { name: string; id: number };
    lastPlayed: number;
    gameType: number;
    difficulty: number;
    difficultyLocked: boolean;
    time: number;
    raining: boolean;
    thundering: boolean;
    dimensions: DimensionData[];
    enabledPacks: string[];
    disabledPacks: string[];
    dragonKilled: boolean;
    previouslyKilled: boolean;
    gateways: number[];
}

export interface LevelState {
    originalFile: NbtFile | null;
    fileName: string | null;
    data: LevelData | null;
    load: (buffer: Uint8Array, fileName: string) => void;
    set: <K extends keyof LevelData>(key: K, value: LevelData[K]) => void;
    exportFile: () => Uint8Array | null;
    reset: () => void;
}

export const useLevelStore = create<LevelState>((set, get) => ({
    originalFile: null,
    fileName: null,
    data: null,

    load: (buffer, fileName) => {
        const file = NbtFile.read(buffer);
        const data = hydrateLevelData(file);
        set({ originalFile: file, fileName, data });
    },

    set: (key, value) => {
        const { data } = get();
        if (!data) return;
        set({ data: { ...data, [key]: value } });
    },

    exportFile: () => {
        const { originalFile, data } = get();
        if (!originalFile || !data) return null;
        return compileLevelData(originalFile, data);
    },

    reset: () => set({ originalFile: null, fileName: null, data: null })
}));

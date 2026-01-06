import type { Datapack, FileStatus } from "@voxelio/breeze";
import { DatapackDownloader } from "@voxelio/breeze";
import { create } from "zustand";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

interface ChangesState {
    compiledDatapack: Datapack | null;
    compiledFiles: Record<string, Uint8Array>;
    originalFiles: Record<string, Uint8Array>;
    diff: Map<string, FileStatus>;
    compile: () => void;
}

export const useChangesStore = create<ChangesState>((set) => ({
    compiledDatapack: null,
    compiledFiles: {},
    originalFiles: {},
    diff: new Map(),
    compile: () => {
        const { files, compile } = useConfiguratorStore.getState();
        const compiledDatapack = compile();
        const compiledFiles = compiledDatapack.getFiles();
        const diff = new DatapackDownloader(compiledFiles).getDiff(files);
        set({ compiledDatapack, compiledFiles, originalFiles: files, diff });
    }
}));

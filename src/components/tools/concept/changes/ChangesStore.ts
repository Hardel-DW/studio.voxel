import type { Datapack, FileStatus } from "@voxelio/breeze";
import { DatapackDownloader } from "@voxelio/breeze";
import { create } from "zustand";
import { useConfiguratorStore } from "@/components/tools/Store";

interface ChangesState {
    compiledDatapack: Datapack | null;
    compiledFiles: Record<string, Uint8Array>;
    originalFiles: Record<string, Uint8Array>;
    diff: Map<string, FileStatus>;
    lastFilesRef: Record<string, Uint8Array> | null;
    compile: () => void;
}

export const useChangesStore = create<ChangesState>((set, get) => ({
    compiledDatapack: null,
    compiledFiles: {},
    originalFiles: {},
    diff: new Map(),
    lastFilesRef: null,
    compile: () => {
        const { files, compile } = useConfiguratorStore.getState();
        if (get().lastFilesRef === files) return;

        const compiledDatapack = compile();
        const compiledFiles = compiledDatapack.getFiles();
        const diff = new DatapackDownloader(compiledFiles).getDiff(files);
        set({ compiledDatapack, compiledFiles, originalFiles: files, diff, lastFilesRef: files });
    }
}));

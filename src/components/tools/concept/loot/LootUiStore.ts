import { create } from "zustand";

interface LootUiState {
    selectedPath: string;
    viewMode: "grid" | "list";
    search: string;

    setSelectedPath: (path: string) => void;
    setViewMode: (mode: "grid" | "list") => void;
    setSearch: (search: string) => void;
}

export const useLootUiStore = create<LootUiState>((set) => ({
    selectedPath: "",
    viewMode: "grid",
    search: "",

    setSelectedPath: (path) => set({ selectedPath: path }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setSearch: (search) => set({ search }),
}));

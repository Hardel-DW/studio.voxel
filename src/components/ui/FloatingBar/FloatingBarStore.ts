import { create } from "zustand";
import type { FloatingBarContent } from "./types";

interface FloatingBarState {
    content: FloatingBarContent | null;
    isVisible: boolean;
    searchValue: string;
    setContent: (content: FloatingBarContent | null) => void;
    setSearchValue: (value: string) => void;
    clear: () => void;
}

export const useFloatingBarStore = create<FloatingBarState>((set) => ({
    content: null,
    isVisible: false,
    searchValue: "",
    setContent: (content) => set({ content, isVisible: !!content }),
    setSearchValue: (value) => set({ searchValue: value }),
    clear: () => set({ content: null, isVisible: false, searchValue: "" })
}));

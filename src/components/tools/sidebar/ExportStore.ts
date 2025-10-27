import { create } from "zustand";

interface ExportState {
    isGitRepository: boolean;
    owner: string;
    repositoryName: string;
    branch: string;
    token: string | null;
    isInitializing: number | null;
    setGitRepository: (owner: string, repositoryName: string, branch: string, token: string) => void;
    clearGitRepository: () => void;
    setInitializing: (isInitializing: number | null) => void;
}

export const useExportStore = create<ExportState>((set) => ({
    isGitRepository: false,
    owner: "",
    repositoryName: "",
    branch: "",
    token: null,
    isInitializing: null,
    setGitRepository: (owner, repositoryName, branch, token) => set({ isGitRepository: true, owner, repositoryName, branch, token }),
    clearGitRepository: () => set({ isGitRepository: false, owner: "", repositoryName: "", branch: "", token: null }),
    setInitializing: (isInitializing) => set({ isInitializing })
}));

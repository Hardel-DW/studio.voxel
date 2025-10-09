import { create } from "zustand";

interface ExportState {
    isGitRepository: boolean;
    repository: string;
    currentBranch: string;
    setIsGitRepository: (isGit: boolean) => void;
    setRepository: (repository: string) => void;
    setCurrentBranch: (branch: string) => void;
}

export const useExportStore = create<ExportState>((set) => ({
    isGitRepository: true,
    repository: "FooBar",
    currentBranch: "main",
    setIsGitRepository: (isGit) => set({ isGitRepository: isGit }),
    setRepository: (repository) => set({ repository: repository }),
    setCurrentBranch: (branch) => set({ currentBranch: branch })
}));

import type { Datapack } from "@voxelio/breeze";
import { analyserCollection, FileStatusComparator, Identifier } from "@voxelio/breeze";
import { create } from "zustand";
import { useConfiguratorStore } from "@/components/tools/Store";

interface DebugState {
    isDebugModalOpen: boolean;
    selectedElement: string | undefined;
    selectedRegistry: string;
    selectedNamespace: string;
    compiledDatapack: Datapack | null;
    fileStatusComparator: FileStatusComparator | null;
    registries: string[];
    namespaces: string[];
    format: "voxel" | "datapack" | "original" | "logs";
    openDebugModal: (compiledDatapack: Datapack) => void;
    closeDebugModal: () => void;
    setSelectedRegistry: (registry: string) => void;
    setSelectedNamespace: (namespace: string) => void;
    setSelectedElement: (uniqueKey: string | undefined) => void;
    getFilteredElements: () => string[];
    setFormat: (format: "voxel" | "datapack" | "original" | "logs") => void;
}

export const useDebugStore = create<DebugState>((set, get) => ({
    isDebugModalOpen: false,
    selectedElement: undefined,
    selectedRegistry: "",
    selectedNamespace: "",
    compiledDatapack: null,
    fileStatusComparator: null,
    registries: [],
    namespaces: [],
    format: "voxel",
    openDebugModal: (compiledDatapack) => {
        const { files, elements, logger } = useConfiguratorStore.getState();
        const namespaces = compiledDatapack.getNamespaces();
        const registries = Object.keys(analyserCollection).flatMap((registry) => {
            const analyser = analyserCollection[registry as keyof typeof analyserCollection];
            return analyser.hasTag ? [registry, `tags/${registry}`] : [registry];
        });

        if (!logger) throw new Error("Logger is not initialized");
        const fileStatusComparator = new FileStatusComparator(files, elements, logger);
        const allKeys = Array.from(fileStatusComparator.getAllFileStatuses().keys());

        set({
            isDebugModalOpen: true,
            compiledDatapack,
            fileStatusComparator,
            selectedRegistry: registries[0],
            selectedNamespace: namespaces[0],
            selectedElement: allKeys[0],
            registries,
            namespaces
        });
    },
    closeDebugModal: () => set({ isDebugModalOpen: false, compiledDatapack: null, fileStatusComparator: null }),
    setSelectedRegistry: (registry) => set({ selectedRegistry: registry }),
    setSelectedNamespace: (namespace) => set({ selectedNamespace: namespace }),
    setSelectedElement: (uniqueKey) => set({ selectedElement: uniqueKey }),
    setFormat: (format) => set({ format }),
    getFilteredElements: () => {
        const { fileStatusComparator, selectedRegistry, selectedNamespace } = get();
        if (!fileStatusComparator) return [];

        return Array.from(fileStatusComparator.getAllFileStatuses().keys())
            .filter((uniqueKey) => {
                const identifier = Identifier.fromUniqueKey(uniqueKey);
                const registryMatch = !selectedRegistry || identifier.registry === selectedRegistry;
                const namespaceMatch = !selectedNamespace || identifier.namespace === selectedNamespace;
                return registryMatch && namespaceMatch;
            })
            .sort((a, b) => {
                const identifierA = Identifier.fromUniqueKey(a);
                const identifierB = Identifier.fromUniqueKey(b);
                const resourceA = identifierA.resource.split("/").pop() || identifierA.resource;
                const resourceB = identifierB.resource.split("/").pop() || identifierB.resource;
                return resourceA.localeCompare(resourceB);
            });
    }
}));

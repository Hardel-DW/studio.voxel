import { create } from "zustand";
import { getLabeledIdentifier } from "@voxelio/breeze/core";
import type { LabeledElement } from "@voxelio/breeze/core";
import { analyserCollection, Datapack } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";

interface DebugState {
    isDebugModalOpen: boolean;
    selectedElement: LabeledElement | undefined;
    selectedRegistry: string;
    selectedNamespace: string;
    elements: LabeledElement[];
    registries: string[];
    namespaces: string[];
    format: "voxel" | "datapack" | "original";
    openDebugModal: (elements: LabeledElement[]) => void;
    closeDebugModal: () => void;
    setSelectedRegistry: (registry: string) => void;
    setSelectedNamespace: (namespace: string) => void;
    setSelectedElement: (element: LabeledElement | undefined) => void;
    getFilteredElements: () => LabeledElement[];
    setFormat: (format: "voxel" | "datapack" | "original") => void;
}

export const useDebugStore = create<DebugState>((set, get) => ({
    isDebugModalOpen: false,
    selectedElement: undefined,
    selectedRegistry: "",
    selectedNamespace: "",
    elements: [],
    registries: [],
    namespaces: [],
    format: "voxel",
    // Actions
    openDebugModal: (elements) => {
        const namespaces = new Datapack(useConfiguratorStore.getState().files).getNamespaces();
        const registries = Object.keys(analyserCollection).flatMap((registry) => {
            const analyser = analyserCollection[registry as keyof typeof analyserCollection];
            return analyser.hasTag ? [registry, `tags/${registry}`] : [registry];
        });

        set({
            isDebugModalOpen: true,
            elements: elements,
            selectedRegistry: registries[0],
            selectedNamespace: namespaces[0],
            selectedElement: elements[0],
            registries,
            namespaces
        });
    },
    closeDebugModal: () => set({ isDebugModalOpen: false }),

    setSelectedRegistry: (registry) => set({ selectedRegistry: registry }),
    setSelectedNamespace: (namespace) => set({ selectedNamespace: namespace }),
    setSelectedElement: (element) => set({ selectedElement: element }),
    getFilteredElements: () => {
        const { elements, selectedRegistry, selectedNamespace } = get();

        return elements
            .filter((element) => {
                const identifier = getLabeledIdentifier(element);
                const registryMatch = !selectedRegistry || identifier.registry === selectedRegistry;
                const namespaceMatch = !selectedNamespace || identifier.namespace === selectedNamespace;
                return registryMatch && namespaceMatch;
            })
            .sort((a, b) => {
                const identifierA = getLabeledIdentifier(a);
                const identifierB = getLabeledIdentifier(b);
                // Extract just the filename part after the last slash for sorting
                const resourceA = identifierA.resource.split("/").pop() || identifierA.resource;
                const resourceB = identifierB.resource.split("/").pop() || identifierB.resource;
                return resourceA.localeCompare(resourceB);
            });
    },
    setFormat: (format) => {
        set({ format });
    }
}));

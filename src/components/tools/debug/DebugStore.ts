import { create } from "zustand";
import { Identifier } from "@voxelio/breeze/core";
import type { LabeledElement } from "@voxelio/breeze/core";
import { analyserCollection, Datapack, getLabeledIdentifier } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";

interface DebugState {
    isDebugModalOpen: boolean;
    selectedElement: string | undefined;
    selectedRegistry: string;
    selectedNamespace: string;
    elements: Map<string, LabeledElement | undefined>;
    registries: string[];
    namespaces: string[];
    format: "voxel" | "datapack" | "original";
    openDebugModal: (labeledElements: LabeledElement[]) => void;
    closeDebugModal: () => void;
    setSelectedRegistry: (registry: string) => void;
    setSelectedNamespace: (namespace: string) => void;
    setSelectedElement: (uniqueKey: string | undefined) => void;
    getFilteredElements: () => string[];
    setFormat: (format: "voxel" | "datapack" | "original") => void;
}

export const useDebugStore = create<DebugState>((set, get) => ({
    isDebugModalOpen: false,
    selectedElement: undefined,
    selectedRegistry: "",
    selectedNamespace: "",
    elements: new Map(),
    registries: [],
    namespaces: [],
    format: "voxel",
    openDebugModal: (labeledElements) => {
        const mainStore = useConfiguratorStore.getState();
        const namespaces = new Datapack(mainStore.files).getNamespaces();
        const registries = Object.keys(analyserCollection).flatMap((registry) => {
            const analyser = analyserCollection[registry as keyof typeof analyserCollection];
            return analyser.hasTag ? [registry, `tags/${registry}`] : [registry];
        });

        const elementsMap = new Map<string, LabeledElement | undefined>(
            Array.from(mainStore.elements.keys()).map(uniqueKey => [uniqueKey, undefined])
        );

        for (const labeledElement of labeledElements) {
            elementsMap.set(new Identifier(getLabeledIdentifier(labeledElement)).toUniqueKey(), labeledElement);
        }

        set({
            isDebugModalOpen: true,
            elements: elementsMap,
            selectedRegistry: registries[0],
            selectedNamespace: namespaces[0],
            selectedElement: Array.from(elementsMap.keys())[0],
            registries,
            namespaces
        });
    },
    closeDebugModal: () => set({ isDebugModalOpen: false }),
    setSelectedRegistry: (registry) => set({ selectedRegistry: registry }),
    setSelectedNamespace: (namespace) => set({ selectedNamespace: namespace }),
    setSelectedElement: (uniqueKey) => set({ selectedElement: uniqueKey }),
    setFormat: (format) => set({ format }),
    getFilteredElements: () => {
        const { elements, selectedRegistry, selectedNamespace } = get();

        return Array.from(elements.keys())
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

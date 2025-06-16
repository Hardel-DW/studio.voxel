import { Datapack, type VoxelElement } from "@voxelio/breeze";
import { isVoxelElement } from "@voxelio/breeze/core";
import { compileDatapack } from "@voxelio/breeze/core";
import { updateData } from "@voxelio/breeze/core";
import type { Analysers, GetAnalyserVoxel } from "@voxelio/breeze/core";
import type { ParseDatapackResult } from "@voxelio/breeze/core";
import type { ActionValue } from "@voxelio/breeze/core";
import type { Action } from "@voxelio/breeze/core";
import type { Logger } from "@voxelio/breeze/core";
import type { LabeledElement } from "@voxelio/breeze/core";
import { create } from "zustand";
import { CONCEPTS, type CONCEPT_KEY } from "./elements";

export interface ConfiguratorState<T extends keyof Analysers> {
    name: string;
    minify: boolean;
    logger?: Logger;
    files: Record<string, Uint8Array>;
    elements: Map<string, GetAnalyserVoxel<T>>;
    currentElementId?: string | null;
    isModded: boolean;
    version: number | null;
    sortedIdentifiers: Map<string, string[]>;
    selectedConcept: CONCEPT_KEY | null;
    getSortedIdentifiers: (registry: string) => string[];
    setName: (name: string) => void;
    setMinify: (minify: boolean) => void;
    setCurrentElementId: (id: string | null) => void;
    handleChange: (action: Action, identifier?: string, value?: ActionValue) => Promise<void>;
    setup: (updates: ParseDatapackResult<GetAnalyserVoxel<T>>) => void;
    compile: () => Array<LabeledElement>;
    getLengthByRegistry: (registry: string) => number;
    setSelectedConcept: (concept: CONCEPT_KEY) => void;
}

const createConfiguratorStore = <T extends keyof Analysers>() =>
    create<ConfiguratorState<T>>((set, get) => ({
        name: "",
        minify: true,
        files: {},
        elements: new Map(),
        isModded: false,
        version: null,
        sortedIdentifiers: new Map(),
        selectedConcept: CONCEPTS[0].registry as CONCEPT_KEY,
        getSortedIdentifiers: (registry) => get().sortedIdentifiers.get(registry) ?? [],
        setName: (name) => set({ name }),
        setMinify: (minify) => set({ minify }),
        setCurrentElementId: (currentElementId) => set({ currentElementId }),
        handleChange: async (action, identifier) => {
            const state = get();
            const elementId = identifier ?? state.currentElementId;
            if (!elementId) return;

            const element = state.elements.get(elementId);
            if (!element) return;

            const updatedElement = await state.logger?.trackChanges(element, (el) =>
                updateData(action, el, state.version ?? Number.POSITIVE_INFINITY)
            );

            if (!updatedElement || !isVoxelElement(updatedElement)) return;
            set((state) => ({ elements: state.elements.set(elementId, updatedElement) }));
        },
        setup: (updates) => set({ ...updates, sortedIdentifiers: sortElementsByRegistry(updates.elements) }),
        compile: () => {
            console.log("compile");
            const { elements, version, files, selectedConcept } = get();
            if (!version || !files || !selectedConcept) return [];
            return compileDatapack({ elements: Array.from(elements.values()), files });
        },
        getLengthByRegistry: (registry) => new Datapack(get().files).getRegistry(registry).length,
        setSelectedConcept: (concept) => set({ selectedConcept: concept })
    }));

export const useConfiguratorStore = createConfiguratorStore();
export const getCurrentElement = <T extends keyof Analysers>(state: ConfiguratorState<T>) =>
    state.currentElementId ? state.elements.get(state.currentElementId) : undefined;

/**
 * Sorts voxel elements by registry and then alphabetically
 * @param elements - Map of voxel elements
 * @returns Map of registry to sorted identifiers
 */
export function sortElementsByRegistry(elements: Map<string, VoxelElement>): Map<string, string[]> {
    const grouped = new Map<string, string[]>();

    for (const [id, element] of elements.entries()) {
        const registry = element.identifier.registry;
        if (!grouped.has(registry)) {
            grouped.set(registry, []);
        }
        grouped.get(registry)?.push(id);
    }

    for (const [_, ids] of grouped.entries()) {
        ids.sort((a, b) => {
            const elementA = elements.get(a);
            const elementB = elements.get(b);
            if (!elementA || !elementB) return 0;
            const resourceA = elementA.identifier.resource.split("/").pop() ?? "";
            const resourceB = elementB.identifier.resource.split("/").pop() ?? "";
            return resourceA.localeCompare(resourceB);
        });
    }

    return grouped;
}

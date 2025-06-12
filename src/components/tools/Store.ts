import { Datapack } from "@voxelio/breeze";
import { isVoxelElement, sortVoxelElements } from "@voxelio/breeze/core";
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
    sortedIdentifiers: string[];
    selectedConcept: CONCEPT_KEY | null;
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
        sortedIdentifiers: [],
        selectedConcept: CONCEPTS[0].registry as CONCEPT_KEY,
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
        setup: (updates) => set({ ...updates, sortedIdentifiers: sortVoxelElements(updates.elements) }),
        compile: () => {
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

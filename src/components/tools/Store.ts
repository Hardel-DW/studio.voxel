import { Datapack, type InterfaceConfiguration, type Roadmap } from "@voxelio/breeze";
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

export interface ConfiguratorState<T extends keyof Analysers> {
    name: string;
    minify: boolean;
    logger?: Logger;
    files: Record<string, Uint8Array>;
    elements: Map<string, GetAnalyserVoxel<T>>;
    currentElementId?: string;
    isModded: boolean;
    overview: boolean;
    roadmap: Map<string, Roadmap> | null;
    version: number | null;
    sortedIdentifiers: string[];
    selectedConcept: keyof Analysers | null;
    setName: (name: string) => void;
    setMinify: (minify: boolean) => void;
    setCurrentElementId: (id: string | undefined) => void;
    handleChange: (action: Action, identifier?: string, value?: ActionValue) => void;
    setup: (updates: ParseDatapackResult<GetAnalyserVoxel<T>>) => void;
    compile: () => Array<LabeledElement>;
    getLengthByRegistry: (registry: string) => number;
    setSelectedConcept: (concept: keyof Analysers) => void;
    setRoadmap: (version: number) => void;
    getRoadmap: () => Roadmap | null;
    setOverview: (overview: boolean) => void;
}

const createConfiguratorStore = <T extends keyof Analysers>() =>
    create<ConfiguratorState<T>>((set, get) => ({
        name: "",
        minify: true,
        files: {},
        elements: new Map(),
        roadmap: null,
        isModded: false,
        version: null,
        sortedIdentifiers: [],
        selectedConcept: "enchantment",
        overview: false,
        setOverview: (overview) => set({ overview }),
        setRoadmap: async (version) => {
            const response = await fetch(`/api/schema?key=schema.${version.toString()}@roadmap`);
            const roadmap = await response.json();
            if (!roadmap) return;

            set({ roadmap: new Map(Object.entries(roadmap)) });
        },
        getRoadmap: () => get().roadmap?.get(get().selectedConcept ?? "") ?? null,
        setName: (name) => set({ name }),
        setMinify: (minify) => set({ minify }),
        setCurrentElementId: (currentElementId) => set({ currentElementId }),
        handleChange: (action, identifier, value) => {
            const state = get();
            const elementId = identifier ?? state.currentElementId;
            if (!elementId) return;

            const element = state.elements.get(elementId);
            if (!element) return;

            const updatedElement = updateData(action, element, state.version ?? Number.POSITIVE_INFINITY, value);
            if (!updatedElement) return;

            if (!isVoxelElement(updatedElement)) return;
            if (state.logger && state.version && typeof state.selectedConcept === "string") {
                state.logger.handleActionDifference(action, element, state.selectedConcept, value, state.version);
            }

            set((state) => ({ elements: state.elements.set(elementId, updatedElement) }));
        },
        setup: (updates) => set({ ...updates, sortedIdentifiers: sortVoxelElements(updates.elements) }),
        compile: () => {
            const { elements, version, files, selectedConcept } = get();
            if (!version || !files || !selectedConcept) return [];
            return compileDatapack({ elements: Array.from(elements.values()), version, files, tool: selectedConcept });
        },
        getLengthByRegistry: (registry) => new Datapack(get().files).getRegistry(registry).length,
        setSelectedConcept: (concept) => set({ selectedConcept: concept })
    }));

export const useConfiguratorStore = createConfiguratorStore();
export const getCurrentElement = <T extends keyof Analysers>(state: ConfiguratorState<T>) =>
    state.currentElementId ? state.elements.get(state.currentElementId) : undefined;

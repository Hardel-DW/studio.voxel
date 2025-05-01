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
    roadmap: Map<string, Roadmap> | null;
    schema: Map<string, InterfaceConfiguration> | null;
    version: number | null;
    sortedIdentifiers: string[];
    selectedConcept: keyof Analysers | null;
    registry: Map<string, unknown> | null;
    lastSchemaUpdate: number | null;
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
    addRegistry: (registry: string) => void;
    addSchema: (id: string, registry: string) => void;
    clearSchemaCache: () => void;
}

const createConfiguratorStore = <T extends keyof Analysers>() =>
    create<ConfiguratorState<T>>((set, get) => ({
        name: "",
        minify: true,
        files: {},
        elements: new Map(),
        schema: new Map(),
        roadmap: null,
        isModded: false,
        version: null,
        sortedIdentifiers: [],
        selectedConcept: "enchantment",
        registry: new Map(),
        lastSchemaUpdate: null,
        setRoadmap: async (version) => {
            const response = await fetch(`/api/tools/schema?key=schema.${version.toString()}@roadmap`);
            const roadmap = await response.json();
            if (!roadmap) return;

            set({ roadmap: new Map(Object.entries(roadmap)) });
        },
        addSchema: async (id, registry) => {
            const schemaKeyId = get()
                .roadmap?.get(registry)
                ?.schema.find((schema) => schema.id === id)?.content;

            if (typeof schemaKeyId !== "string") return;
            const response = await fetch(`/api/tools/schema?key=${schemaKeyId}`);
            const schema = await response.json();
            if (!schema) return;
            set((state) => ({ schema: new Map(state.schema).set(id, schema) }));
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
        setSelectedConcept: (concept) => set({ selectedConcept: concept }),
        addRegistry: async (registry) => {
            if (get().registry?.has(registry)) return;
            const registryData = await (await fetch(`/api/engine/registry/get?registry=${registry}`)).json();
            if (!registryData) return;
            set((state) => ({ registry: new Map(state.registry).set(registry, registryData) }));
        },
        clearSchemaCache: () => {
            const now = Date.now();
            const lastUpdate = get().lastSchemaUpdate;
            if (lastUpdate && now - lastUpdate < 1000 * 60 * 1) {
                console.log("Schema cache clearing is on cooldown.");
                return;
            }
            set({ schema: new Map(), lastSchemaUpdate: now });
        }
    }));

export const useConfiguratorStore = createConfiguratorStore();
export const getCurrentElement = <T extends keyof Analysers>(state: ConfiguratorState<T>) =>
    state.currentElementId ? state.elements.get(state.currentElementId) : undefined;

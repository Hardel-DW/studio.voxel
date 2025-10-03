import type { Action, ActionValue, Analysers, DataDrivenElement, DataDrivenRegistryElement, GetAnalyserVoxel, VoxelElement, Datapack, ParseDatapackResult } from "@voxelio/breeze";
import { compileDatapack, isVoxelElement, Logger, updateData } from "@voxelio/breeze";
import { create } from "zustand";
import type { CONCEPT_KEY } from "./elements";

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
    getSortedIdentifiers: (registry: string) => string[];
    setName: (name: string) => void;
    setMinify: (minify: boolean) => void;
    setCurrentElementId: (id: string | null) => void;
    handleChange: (action: Action, identifier?: string, value?: ActionValue) => void;
    setup: (updates: ParseDatapackResult<GetAnalyserVoxel<T>>) => void;
    compile: () => Datapack;
    getLengthByRegistry: (registry: string) => number;
    getConcept: (pathname: string) => CONCEPT_KEY | null;
    getRegistry: <R extends DataDrivenElement>(
        registry: string,
        options?: { path?: string; excludeNamespaces?: string[] }
    ) => DataDrivenRegistryElement<R>[];
}

const createConfiguratorStore = <T extends keyof Analysers>() =>
    create<ConfiguratorState<T>>((set, get) => ({
        name: "",
        minify: true,
        logger: new Logger(),
        files: {},
        elements: new Map(),
        isModded: false,
        version: null,
        sortedIdentifiers: new Map(),
        getSortedIdentifiers: (registry) => get().sortedIdentifiers.get(registry) ?? [],
        setName: (name) => set({ name }),
        setMinify: (minify) => set({ minify }),
        setCurrentElementId: (currentElementId) => set({ currentElementId }),
        handleChange: (action, identifier) => {
            const state = get();
            const elementId = identifier ?? state.currentElementId;
            if (!elementId) return;

            const element = state.elements.get(elementId);
            if (!element) return;

            const updatedElement = state.logger?.trackChanges(element, (el) =>
                updateData(action, el, state.version ?? Number.POSITIVE_INFINITY)
            );

            if (!updatedElement || !isVoxelElement(updatedElement)) return;
            set((state) => ({ elements: state.elements.set(elementId, updatedElement) }));
        },
        setup: (updates) => set({ ...updates, sortedIdentifiers: sortElementsByRegistry(updates.elements) }),
        compile: () => compileDatapack({ elements: Array.from(get().elements.values()), files: get().files }),
        getLengthByRegistry: (registry) => get().getRegistry(registry).length,
        getConcept: (pathname) => {
            const pathParts = pathname.split("/").filter(Boolean);
            if (pathParts.length >= 4 && pathParts[1] === "studio" && pathParts[2] === "editor") {
                return pathParts[3] as CONCEPT_KEY;
            }
            return null;
        },
        getRegistry: <R extends DataDrivenElement>(registry: string, options?: { path?: string; excludeNamespaces?: string[] }) => {
            return get().compile().getRegistry<R>(registry, options?.path, options?.excludeNamespaces);
        }
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

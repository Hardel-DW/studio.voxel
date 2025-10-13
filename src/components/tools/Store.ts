import type {
    Action,
    ActionValue,
    Analysers,
    DataDrivenElement,
    DataDrivenRegistryElement,
    Datapack,
    GetAnalyserVoxel,
    ParseDatapackResult
} from "@voxelio/breeze";
import { compileDatapack, isVoxelElement, Logger, sortElementsByRegistry, updateData } from "@voxelio/breeze";
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
    registryCache: Map<string, DataDrivenRegistryElement<any>[]>;
    custom: Map<string, Uint8Array>;
    addFile: (key: string, value: Uint8Array) => void;
    getSortedIdentifiers: (registry: string) => string[];
    setName: (name: string) => void;
    setMinify: (minify: boolean) => void;
    setCurrentElementId: (id: string | null) => void;
    handleChange: (action: Action, identifier?: string, value?: ActionValue) => void;
    setup: (updates: ParseDatapackResult<GetAnalyserVoxel<T>>, isModded: boolean, name: string) => void;
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
        custom: new Map(),
        elements: new Map(),
        isModded: false,
        version: null,
        sortedIdentifiers: new Map(),
        registryCache: new Map(),
        addFile: (key, value) => set({ custom: get().custom.set(key, value) }),
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
        setup: (updates, isModded, name) =>
            set({ ...updates, sortedIdentifiers: sortElementsByRegistry(updates.elements), isModded, name }),
        compile: () =>
            compileDatapack({
                elements: Array.from(get().elements.values()),
                files: get().files,
                additionnal: Object.fromEntries(get().custom)
            }),
        getLengthByRegistry: (registry) => get().getRegistry(registry).length,
        getConcept: (pathname) => {
            const pathParts = pathname.split("/").filter(Boolean);
            if (pathParts.length >= 4 && pathParts[1] === "studio" && pathParts[2] === "editor") {
                return pathParts[3] as CONCEPT_KEY;
            }
            return null;
        },
        getRegistry: <R extends DataDrivenElement>(registry: string, options?: { path?: string; excludeNamespaces?: string[] }) => {
            const cacheKey = buildCacheKey(registry, options);
            const cached = get().registryCache.get(cacheKey) as DataDrivenRegistryElement<R>[] | undefined;
            if (cached) return cached;

            const registryData = get().compile().getRegistry<R>(registry, options?.path, options?.excludeNamespaces);
            get().registryCache.set(cacheKey, registryData);
            return registryData;
        }
    }));

export const useConfiguratorStore = createConfiguratorStore();
export const getCurrentElement = <T extends keyof Analysers>(state: ConfiguratorState<T>) =>
    state.currentElementId ? state.elements.get(state.currentElementId) : undefined;

const buildCacheKey = (registry: string, options?: { path?: string; excludeNamespaces?: string[] }) => {
    if (!options) return registry;
    const pathKey = options.path ?? "";
    const excludeKey = options.excludeNamespaces?.length ? [...options.excludeNamespaces].sort().join(",") : "";
    return `${registry}|${pathKey}|${excludeKey}`;
};

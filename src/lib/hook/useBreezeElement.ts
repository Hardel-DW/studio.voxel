import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { checkCondition, checkLocks, getConditionFields, getLockFields, getRendererFields, getValue } from "@voxelio/breeze/core";
import type {
    Condition,
    FormComponent,
    InterfaceConfiguration,
    Lock,
    Roadmap,
    TranslateTextType,
    ValueRenderer,
    VoxelElement
} from "@voxelio/breeze/core";
import { useShallow } from "zustand/shallow";
import { useQuery } from "@tanstack/react-query";
import { fetchSchemaData, fetchApiSchemaItem } from "@/lib/utils/schema";

const useElementFields = (fields: string[], elementId?: string): Partial<VoxelElement> | null => {
    return useConfiguratorStore(
        useShallow((state): Partial<VoxelElement> | null => {
            const id = elementId ? state.elements.get(elementId) : getCurrentElement(state);
            if (!id) return null;

            return fields.reduce(
                (acc, field) => {
                    acc[field] = id[field];
                    return acc;
                },
                {} as Partial<VoxelElement>
            );
        })
    );
};

export const useElementValue = <T>(renderer: ValueRenderer, elementId?: string): T | null => {
    if (!renderer) return null;

    const fields = getRendererFields(renderer);
    const element = useElementFields(fields, elementId);

    if (!element) return null;
    return getValue<T>(renderer, element);
};

export const useElementCondition = (condition: Condition | undefined, elementId?: string, value?: any): boolean => {
    if (!condition) return false;

    const fields = getConditionFields(condition);
    const element = useElementFields(fields, elementId);

    if (!element) return false;
    return checkCondition(condition, element, value);
};

export const useElementLocks = (locks: Lock[] | undefined, elementId?: string): { isLocked: boolean; text?: TranslateTextType } => {
    if (!locks) return { isLocked: false };

    const fields = getLockFields(locks);
    const element = useElementFields(fields, elementId);

    if (!element) return { isLocked: false };
    return checkLocks(locks, element);
};

export const useRoadmap = (version: number | null) => {
    const selectedConcept = useConfiguratorStore((state) => state.selectedConcept);
    if (!selectedConcept) return { data: null, isLoading: false, isError: false, error: null };

    const { data, isLoading, isError, error } = useQuery<Record<string, Roadmap> | null, Error>({
        queryKey: ["roadmap", version, "schema"],
        queryFn: async () => {
            if (!version) return null;
            return fetchApiSchemaItem<Record<string, Roadmap>>(`schema.${version.toString()}@roadmap`);
        },
        enabled: !!version
    });

    const roadmap = data ? (data[selectedConcept] ?? null) : null;
    return { data: roadmap, isLoading, isError, error };
};

export const useSchema = (id: string): FormComponent[] | undefined => {
    const selectedConcept = useConfiguratorStore((state) => state.selectedConcept);
    const version = useConfiguratorStore((state) => state.version);
    const { data: fullRoadmapData, isLoading: isRoadmapLoading, isError: isRoadmapError } = useRoadmap(version);

    const { data, isLoading, isError } = useQuery<InterfaceConfiguration | null, Error>({
        queryKey: ["schema", id, selectedConcept],
        queryFn: () => fetchSchemaData(id, selectedConcept, fullRoadmapData),
        enabled: !!id && !!selectedConcept && !!fullRoadmapData && !isRoadmapLoading && !isRoadmapError && !!version
    });

    if (isLoading || isRoadmapLoading) {
        return undefined;
    }

    if (isError || isRoadmapError || !data) {
        return undefined;
    }

    return data.components;
};

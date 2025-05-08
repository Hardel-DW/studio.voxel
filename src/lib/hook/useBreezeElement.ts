import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { checkCondition, checkLocks, getConditionFields, getLockFields, getRendererFields, getValue } from "@voxelio/breeze/core";
import type {
    Condition,
    FormComponent,
    InterfaceConfiguration,
    Lock,
    TranslateTextType,
    ValueRenderer,
    VoxelElement
} from "@voxelio/breeze/core";
import { useShallow } from "zustand/shallow";
import { useQuery } from "@tanstack/react-query";

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

const fetchSchemaData = async (schemaId: string, concept: string | null | undefined): Promise<InterfaceConfiguration | null> => {
    if (!concept) {
        console.warn("fetchSchemaData: concept is missing, cannot fetch schema for id:", schemaId);
        return null;
    }

    const roadmap = useConfiguratorStore.getState().getRoadmap();
    if (!roadmap) {
        console.warn("fetchSchemaData: roadmap is not available for concept:", concept);
        return null;
    }

    const schemaMeta = roadmap.schema.find((s) => s.id === schemaId);
    if (!schemaMeta?.content) {
        console.warn(`fetchSchemaData: schemaKeyId not found in roadmap for schemaId: ${schemaId} and concept: ${concept}`);
        return null;
    }
    const schemaKeyId = schemaMeta.content;

    console.log(`fetchSchemaData: Fetching schema for key: ${schemaKeyId}`);
    const response = await fetch(`/api/schema?key=${schemaKeyId}`);
    if (!response.ok) {
        throw new Error(`Network response was not ok for schema key ${schemaKeyId}`);
    }
    const data = await response.json();
    return data as InterfaceConfiguration;
};

export const useSchema = (id: string): FormComponent[] | undefined => {
    const selectedConcept = useConfiguratorStore((state) => state.selectedConcept);

    const queryKey = ["schema", id, selectedConcept];
    const {
        data: schemaData,
        isLoading,
        isError
    } = useQuery<InterfaceConfiguration | null, Error>({
        queryKey: queryKey,
        queryFn: () => fetchSchemaData(id, selectedConcept),
        enabled: !!id && !!selectedConcept
    });

    if (isLoading) {
        return undefined;
    }

    if (isError || !schemaData) {
        return undefined;
    }

    return schemaData.components;
};

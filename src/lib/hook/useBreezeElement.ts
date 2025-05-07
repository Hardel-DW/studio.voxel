import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { checkCondition, checkLocks, getConditionFields, getLockFields, getRendererFields, getValue } from "@voxelio/breeze/core";
import type { Condition, FormComponent, Lock, TranslateTextType, ValueRenderer, VoxelElement } from "@voxelio/breeze/core";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

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

export const useSchema = (id: string): FormComponent[] | undefined => {
    const roadmap = useConfiguratorStore((state) => state.getRoadmap());
    if (!roadmap) return undefined;

    const schemaIdFound = roadmap.schema.find((schema) => schema.id === id);
    if (!schemaIdFound) return undefined;

    const addSchema = useConfiguratorStore((state) => state.addSchema);
    const selectedConcept = useConfiguratorStore((state) => state.selectedConcept);
    const hasSchema = useConfiguratorStore((state) => state.schema?.has(schemaIdFound.id) ?? false);
    const pendingSchemas = useConfiguratorStore((state) => state.pendingSchemas);

    useEffect(() => {
        if (!hasSchema && selectedConcept && !pendingSchemas.has(schemaIdFound.id)) {
            addSchema(schemaIdFound.id, selectedConcept);
        }
    }, [addSchema, selectedConcept, hasSchema, pendingSchemas, schemaIdFound?.id]);

    const schema = useConfiguratorStore(
        useShallow((state) => {
            const schemaData = state.schema?.get(schemaIdFound.id);
            if (!schemaData) return null;
            return schemaData;
        })
    );

    if (!schema) return undefined;
    return schema.components;
};

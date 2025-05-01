import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { checkCondition, checkLocks, getConditionFields, getLockFields, getRendererFields, getValue } from "@voxelio/breeze/core";
import type { Condition, FormComponent, Lock, TranslateTextType, ValueRenderer, VoxelElement } from "@voxelio/breeze/core";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";

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

    const schemaId = roadmap.schema.find((schema) => schema.id === id);
    if (!schemaId) return undefined;

    const addSchema = useConfiguratorStore((state) => state.addSchema);
    const selectedConcept = useConfiguratorStore((state) => state.selectedConcept);
    const hasSchema = useConfiguratorStore((state) => state.schema?.has(schemaId.id) ?? false);

    useEffect(() => {
        if (!hasSchema && selectedConcept) addSchema(schemaId.id, selectedConcept);
    }, [hasSchema, addSchema, schemaId.id, selectedConcept]);

    const schema = useConfiguratorStore(
        useShallow((state) => {
            const schema = state.schema?.get(schemaId.id);
            if (!schema) return null;
            return schema;
        })
    );

    if (!schema) return undefined;
    return schema.components;
};

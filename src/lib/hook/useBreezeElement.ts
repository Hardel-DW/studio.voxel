"use client";

import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import type { Lock, LockRenderer } from "@/components/tools/types/component";
import { checkCondition, getConditionFields, getRendererFields, getValue } from "@voxelio/breeze/core";
import type { Condition, ValueRenderer, VoxelElement } from "@voxelio/breeze/core";
import { useShallow } from "zustand/shallow";
import { checkLocks } from "../utils/lock";

const useElementFields = (fields: string[], elementId?: string | null): Partial<VoxelElement> | null => {
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

export const useElementCondition = (condition: Condition | undefined, elementId?: string | null, value?: any): boolean => {
    if (!condition) return false;

    const fields = getConditionFields(condition);
    const element = useElementFields(fields, elementId);

    if (!element) return false;
    return checkCondition(condition, element, value);
};

export const useElementLocks = (locks: Lock[] | undefined, elementId?: string): LockRenderer => {
    if (!locks) return { isLocked: false };

    const fields = locks.flatMap((lock) => getConditionFields(lock.condition));
    const element = useElementFields(fields, elementId);

    if (!element) return { isLocked: false };
    return checkLocks(locks, element);
};

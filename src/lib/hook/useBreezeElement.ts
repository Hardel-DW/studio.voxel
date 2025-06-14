"use client";

import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { useShallow } from "zustand/shallow";
import { checkLocks, type Condition, type Lock, type LockRenderer } from "../utils/lock";
import type { VoxelElement } from "@voxelio/breeze/core";

export type BaseComponent = {
    hide?: (el: VoxelElement) => boolean;
};

export const useElementCondition = (condition: Condition | undefined, elementId?: string): boolean => {
    if (!condition) return false;
    const element = useElement(elementId);

    if (!element) return false;
    return condition(element);
};

export const useElementLocks = (locks: Lock[] | undefined, elementId?: string): LockRenderer => {
    if (!locks) return { isLocked: false };
    const element = useElement(elementId);

    if (!element) return { isLocked: false };
    return checkLocks(locks, element);
};

const useElement = (elementId?: string) => {
    return useConfiguratorStore(
        useShallow((state) => {
            const id = elementId ? state.elements.get(elementId) : getCurrentElement(state);
            return id || null;
        })
    );
};

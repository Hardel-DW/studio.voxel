import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { useShallow } from "zustand/shallow";
import { checkLocks, type Condition, type Lock, type LockRenderer } from "../utils/lock";
import type { VoxelElement } from "@voxelio/breeze/core";

export type BaseComponent = {
    hide?: (el: VoxelElement) => boolean;
};

export const useElementCondition = (condition: Condition | undefined, elementId?: string): boolean => {
    if (!condition) return false;
    // biome-ignore lint/correctness/useHookAtTopLevel: Is for performance  
    const element = useElement(elementId);

    if (!element) return false;
    return condition(element);
};

export const useElementLocks = (locks: Lock[] | undefined, elementId?: string): LockRenderer => {
    if (!locks) return { isLocked: false };
    
    // biome-ignore lint/correctness/useHookAtTopLevel: Is for performance  
    const lockState = useConfiguratorStore(useShallow((state) => {
        const element = elementId ? state.elements.get(elementId) : getCurrentElement(state);
        if (!element) return { isLocked: false };
        return checkLocks(locks, element);
    }));

    return lockState;
};

export const useElement = (elementId?: string) => {
    // biome-ignore lint/correctness/useHookAtTopLevel: Is for performance  
    return useConfiguratorStore(useShallow((state) => (elementId ? state.elements.get(elementId) : getCurrentElement(state))));
};

export const useElementProperty = <T>(
    propertySelector: (element: VoxelElement) => T,
    elementId?: string
) => {
    return useConfiguratorStore(useShallow((state) => {
        const element = elementId ? state.elements.get(elementId) : getCurrentElement(state);
        return element ? propertySelector(element) : null;
    }));
};
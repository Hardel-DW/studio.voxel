import type { VoxelElement } from "@voxelio/breeze/core";
import { useShallow } from "zustand/shallow";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { type Condition, checkLocks, type Lock, type LockRenderer } from "../utils/lock";

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

export const useElement = (elementId?: string) => {
    return useConfiguratorStore(useShallow((state) => (elementId ? state.elements.get(elementId) : getCurrentElement(state))));
};

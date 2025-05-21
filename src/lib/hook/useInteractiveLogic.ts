"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import type { BaseInteractiveComponent, LockRenderer } from "@/components/tools/types/component";
import { useElementLocks, useElementValue } from "@/lib/hook/useBreezeElement";
import type { ActionValue } from "@voxelio/breeze/core";

export interface UseInteractiveLogicProps<C extends BaseInteractiveComponent> {
    component: C;
}

export interface UseInteractiveLogicReturn<T> {
    value: T | null;
    lock: LockRenderer;
    handleChange: (newValue: ActionValue) => void;
}

export function useInteractiveLogic<C extends BaseInteractiveComponent, T>(
    props: UseInteractiveLogicProps<C>
): UseInteractiveLogicReturn<T> {
    const { component } = props;

    const value = useElementValue<T>(component.renderer);
    const lock = useElementLocks(component.lock);
    const performGlobalHandleChange = useConfiguratorStore((state) => state.handleChange);
    const currentElementId = useConfiguratorStore((state) => state.currentElementId);

    const handleChange = (newValue: ActionValue) => {
        if (lock.isLocked) return;
        if (currentElementId === null) {
            console.warn("Cannot handle change, currentElementId is null");
            return;
        }
        performGlobalHandleChange(component.action, currentElementId, newValue);
    };

    return { value, lock, handleChange };
}

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
    props: UseInteractiveLogicProps<C>,
    elementId?: string
): UseInteractiveLogicReturn<T> {
    const { component } = props;

    const currentElementId = elementId ?? useConfiguratorStore((state) => state.currentElementId);
    if (!currentElementId) {
        throw new Error("currentElementId is null");
    }

    const value = useElementValue<T>(component.renderer, currentElementId);
    const lock = useElementLocks(component.lock, currentElementId);
    const performGlobalHandleChange = useConfiguratorStore((state) => state.handleChange);

    const handleChange = (newValue: ActionValue) => {
        if (lock.isLocked) return;
        performGlobalHandleChange(component.action, currentElementId, newValue);
    };

    return { value, lock, handleChange };
}

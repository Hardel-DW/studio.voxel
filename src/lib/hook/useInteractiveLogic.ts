import { useConfiguratorStore } from "@/components/tools/Store";
import type { LockRenderer, Lock } from "../utils/lock";
import { type BaseComponent, useElementLocks, useElementProperty } from "@/lib/hook/useBreezeElement";
import type { Action, ActionValue } from "@voxelio/breeze/core";

export interface UseInteractiveLogicProps<C extends BaseInteractiveComponent> {
    component: C;
}

export type BaseRender = (el: any) => unknown;
export type ActionOrBuilder = Action | ((value: any) => Action);
export type BaseInteractiveComponent = BaseComponent & {
    action: ActionOrBuilder;
    renderer: BaseRender;
    lock?: Lock[];
    elementId?: string;
};

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

    // biome-ignore lint/correctness/useHookAtTopLevel: Is for performance  
    const currentElementId = elementId ?? useConfiguratorStore((state) => state.currentElementId);
    if (!currentElementId) {
        throw new Error("currentElementId is null");
    }

    const value = useElementProperty(component.renderer, currentElementId) as T;

    const lock = useElementLocks(component.lock, currentElementId);
    const performGlobalHandleChange = useConfiguratorStore((state) => state.handleChange);

    const handleChange = (newValue: ActionValue) => {
        if (lock.isLocked) return;

        const actionToPerform = typeof component.action === "function" ? component.action(newValue) : component.action;

        performGlobalHandleChange(actionToPerform, currentElementId, newValue);
    };

    return { value, lock, handleChange };
}
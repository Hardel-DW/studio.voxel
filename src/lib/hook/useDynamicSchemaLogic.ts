import { useState } from "react";
import type { BaseComponent } from "./useBreezeElement";

interface ElementWithId {
    id: string;
    [key: string]: any;
}

export type BaseDynamicSchema<T> = BaseComponent & {
    elements: T[];
};

export function useDynamicSchemaLogic<T extends ElementWithId>(elements: T[] | undefined, initialId?: string) {
    const [currentId, setCurrentId] = useState<string>(() => (elements && elements.length > 0 ? (initialId ?? elements[0].id) : ""));

    if (!elements || elements.length === 0) {
        return {
            currentId: undefined,
            setCurrentId: () => {},
            currentElement: undefined,
            error: new Error("Elements array is undefined or empty in useDynamicSchemaLogic.")
        };
    }

    const currentElement = elements.find((element) => element.id === currentId);
    const error = !currentElement ? new Error(`Current element not found for id: ${currentId}.`) : undefined;

    return {
        currentId,
        setCurrentId,
        currentElement, // This is `T | undefined` from the `find` operation
        error
    };
}

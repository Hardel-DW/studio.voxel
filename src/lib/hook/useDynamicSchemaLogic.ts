import React from "react";

interface ElementWithId {
    id: string;
    [key: string]: any;
}

export function useDynamicSchemaLogic<T extends ElementWithId>(elements: T[] | undefined, initialId?: string) {
    if (!elements || elements.length === 0) {
        return {
            currentId: undefined,
            setCurrentId: () => {},
            currentElement: undefined,
            error: new Error("Elements array is undefined or empty in useDynamicSchemaLogic.")
        };
    }

    const [currentId, setCurrentId] = React.useState<string>(initialId || elements[0].id);
    const currentElement = React.useMemo(() => elements.find((element) => element.id === currentId), [elements, currentId]);
    const error = !currentElement ? new Error(`Current element not found for id: ${currentId}.`) : undefined;

    return {
        currentId,
        setCurrentId,
        currentElement, // This is `T | undefined` from the `find` operation
        error
    };
}

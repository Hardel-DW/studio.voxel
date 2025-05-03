import { useElementCondition, useSchema } from "@/lib/hook/useBreezeElement";
import type { BaseComponent, FormComponent } from "@voxelio/breeze/core";
import React from "react";
import ErrorPlaceholder from "./error/Card";

interface ElementBase {
    id: string;
}

type ComponentWithDynamicElements<E extends ElementBase> = BaseComponent & {
    elements: E[];
    type: string;
};

export interface DynamicSchemaInjectedProps<E extends ElementBase> {
    currentElement: E | undefined;
    composant: FormComponent[] | undefined;
    currentId: string;
    setCurrentId: (id: string) => void;
}

// Export this type
export type WrappedComponentProps<C extends ComponentWithDynamicElements<E>, E extends ElementBase> = {
    component: C;
    dynamicProps: DynamicSchemaInjectedProps<E>;
    index?: number;
};

export const DynamicSchemaComponent = <C extends ComponentWithDynamicElements<E>, E extends ElementBase>(
    WrappedComponent: React.ComponentType<WrappedComponentProps<C, E>>
) => {
    const DynamicSchemaWrapper = ({ component, index }: { component: C; index?: number }) => {
        const shouldHide = useElementCondition(component.hide);
        if (shouldHide) {
            return null;
        }

        const elementsArray = component.elements;
        if (!elementsArray || elementsArray.length === 0) {
            console.error("DynamicSchemaComponent requires a non-empty 'elements' array in component prop", component);
            return <ErrorPlaceholder error={new Error("Component missing 'elements' or 'sections'")} />;
        }

        const [currentId, setCurrentId] = React.useState<string>(elementsArray[0].id);
        const currentElement = elementsArray.find((element: E) => element.id === currentId);
        if (!currentElement) return null;
        const schema = useSchema(currentElement.id);

        // Prepare the props to inject into the WrappedComponent
        const dynamicProps: DynamicSchemaInjectedProps<E> = { currentElement, composant: schema, currentId, setCurrentId };
        return <WrappedComponent component={component} dynamicProps={dynamicProps} index={index} />;
    };

    // Set display name for easier debugging
    DynamicSchemaWrapper.displayName = `DynamicSchemaComponent(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
    return DynamicSchemaWrapper;
};

"use client";

import type { FormComponent } from "@voxelio/breeze/core";
import LoadingSkeleton from "./elements/LoadingComponent";
import { RenderComponent } from "./RenderComponent";

export const RenderSchemaChildren = ({ component }: { component: FormComponent[] | undefined }) => {
    if (!component) return <LoadingSkeleton />;

    return (
        <>
            {component.map((child, index) => (
                <RenderComponent key={index.toString()} component={child} index={index} />
            ))}
        </>
    );
};

"use client";

import type { FormComponent } from "@voxelio/breeze/core";
import { RenderComponent } from "./RenderComponent";
import LoadingSkeleton from "./elements/LoadingComponent";

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

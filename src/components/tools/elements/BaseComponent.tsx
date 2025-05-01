import { useElementCondition } from "@/lib/hook/useBreezeElement";
import type { FormComponent } from "@voxelio/breeze/core";

export const BaseComponent = <T extends FormComponent>(WrappedComponent: React.ComponentType<{ component: T; index?: number }>) => {
    const BaseComponentWrapper = ({ component, index }: { component: T; index?: number }) => {
        const shouldHide = useElementCondition(component.hide);
        if (shouldHide) {
            return null;
        }

        return <WrappedComponent component={component} index={index} />;
    };

    BaseComponentWrapper.displayName = `BaseComponent(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
    return BaseComponentWrapper;
};

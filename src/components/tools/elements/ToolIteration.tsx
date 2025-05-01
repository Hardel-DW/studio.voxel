import { RenderComponent } from "@/components/tools/RenderComponent";
import { useConfiguratorStore } from "@/components/tools/Store";
import { createIterations, resolveIterationValue } from "@voxelio/breeze/core";
import type { FormComponent, TemplateReplacer, ToolIterationType } from "@voxelio/breeze/core";

export default function ToolIteration({ component }: { component: ToolIterationType }) {
    const files = useConfiguratorStore((state) => state.files);
    const iterations = component.values.flatMap((valueSet) => createIterations(valueSet, files));

    return (
        <>
            {iterations.map((iteration, index) => {
                const resolvedTemplate = JSON.parse(JSON.stringify(component.template), (_, value: TemplateReplacer<FormComponent>) =>
                    resolveIterationValue(value, iteration.context)
                );

                return <RenderComponent key={iteration.key} component={resolvedTemplate} index={index} />;
            })}
            {component.fallback && iterations.length === 0 && <RenderComponent key="fallback" component={component.fallback} index={0} />}
        </>
    );
}

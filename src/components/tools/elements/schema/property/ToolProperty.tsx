import type { InteractiveProps } from "@/components/tools/elements/InteractiveComponent";
import { ToolPropertyElement } from "@/components/tools/elements/schema/property/ToolPropertyElement";
import type { ToolPropertyType } from "@voxelio/breeze/core";
import Translate from "@/components/tools/Translate";

export default function ToolProperty({
    component,
    interactiveProps
}: { component: ToolPropertyType; interactiveProps: InteractiveProps<string> }) {
    const { value, handleChange } = interactiveProps;

    return (
        <div className="grid gap-4">
            {!value || Object.keys(value).length === 0 ? (
                <h1 className="text-zinc-400 text-center py-4">
                    <Translate content="tools.enchantments.section.effects.components.empty" />
                </h1>
            ) : null}

            {value &&
                Object.entries(value).map(([effect]) => {
                    return (
                        <ToolPropertyElement
                            key={effect}
                            name={effect}
                            condition={component.condition}
                            onChange={() => handleChange(effect)}
                        />
                    );
                })}
        </div>
    );
}

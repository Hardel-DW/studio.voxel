"use client";

import Translate from "@/components/tools/Translate";
import RenderGuard from "@/components/tools/elements/RenderGuard";
import { ToolPropertyElement } from "@/components/tools/elements/schema/property/ToolPropertyElement";
import type { BaseInteractiveComponent } from "@/components/tools/types/component";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import type { Condition } from "@voxelio/breeze";
import type { ActionValue } from "@voxelio/breeze/core";

export type ToolPropertyType = BaseInteractiveComponent & {
    condition: Condition;
};

export default function ToolProperty(props: ToolPropertyType & { index?: number }) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolPropertyType, Record<string, unknown>>({ component: props });

    const handlePropertyToggle = (propertyName: string) => {
        if (lock.isLocked) return;
        handleChange(propertyName as ActionValue);
    };

    const properties = value ? Object.keys(value) : [];

    return (
        <RenderGuard condition={props.hide}>
            <div className="grid gap-4">
                {properties.length === 0 ? (
                    <h1 className="text-zinc-400 text-center py-4">
                        <Translate content="tools.enchantments.section.effects.components.empty" />
                    </h1>
                ) : null}

                {properties.map((effect) => {
                    return (
                        <ToolPropertyElement
                            key={effect}
                            name={effect}
                            condition={props.condition}
                            onChange={() => handlePropertyToggle(effect)}
                        />
                    );
                })}
            </div>
        </RenderGuard>
    );
}

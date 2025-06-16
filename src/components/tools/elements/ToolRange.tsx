"use client";

import Translate from "@/components/tools/Translate";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import type { TranslateTextType } from "@/components/tools/Translate";
import RenderGuard from "./RenderGuard";
import { getKey } from "@/lib/utils/translation";
import { useState } from "react";

// Type defined locally
export type ToolRangeType = BaseInteractiveComponent & {
    type: "Range";
    label: TranslateTextType;
    min: number;
    max: number;
    step: number;
};

export default function ToolRange(props: ToolRangeType & { index?: number }) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolRangeType, number>({ component: props });
    const [tempValue, setTempValue] = useState<number | null>(null);

    if (value === null) return null;
    const displayValue = tempValue !== null ? tempValue : value;

    const handleMouseUp = () => {
        if (tempValue !== null) {
            handleChange(tempValue);
            setTempValue(null);
        }
    };

    return (
        <RenderGuard condition={props.hide}>
            <div className="relative w-full mt-4">
                <div className="flex justify-between items-center w-full">
                    {lock.isLocked ? (
                        <span className="text-xs text-zinc-400 font-light line-clamp-2">
                            <Translate content={lock.text} />
                        </span>
                    ) : (
                        props.label && (
                            <label htmlFor={getKey(props.label)} className="block line-clamp-1 text-sm font-medium text-zinc-400 mb-1">
                                <Translate content={props.label} schema={true} />
                            </label>
                        )
                    )}
                    <span className="text-sm font-medium text-zinc-400">{displayValue}</span>
                </div>
                <input
                    id={getKey(props.label)}
                    type="range"
                    disabled={lock.isLocked}
                    min={props.min}
                    max={props.max}
                    step={props.step}
                    value={displayValue}
                    onChange={(e) => setTempValue(+e.target.value)}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    className="w-full text-sm font-normal"
                />
            </div>
        </RenderGuard>
    );
}

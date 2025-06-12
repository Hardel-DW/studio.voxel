"use client";

import Translate from "@/components/tools/Translate";
import { getKey } from "@/components/tools/types/component";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import type { BaseInteractiveComponent, TranslateTextType } from "../types/component";
import RenderGuard from "./RenderGuard";

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
    if (value === null) return null;

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
                    <span className="text-sm font-medium text-zinc-400">{value}</span>
                </div>
                <input
                    id={getKey(props.label)}
                    type="range"
                    disabled={lock.isLocked}
                    min={props.min}
                    max={props.max}
                    step={props.step}
                    value={value}
                    onChange={(e) => handleChange(+e.target.value)}
                    className="w-full text-sm font-normal"
                />
            </div>
        </RenderGuard>
    );
}

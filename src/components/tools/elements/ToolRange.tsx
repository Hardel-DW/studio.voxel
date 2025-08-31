import { useRef } from "react";
import RenderGuard from "@/components/tools/elements/RenderGuard";
import type { TranslateTextType } from "@/components/tools/Translate";
import Translate from "@/components/tools/Translate";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { getKey } from "@/lib/utils/translation";

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
    const tempValueRef = useRef<number | null>(null);
    const displayElementRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    if (value === null) return null;
    if (inputRef.current && tempValueRef.current === null) {
        inputRef.current.value = value.toString();
    }

    const handleMouseUp = () => {
        if (tempValueRef.current !== null) {
            handleChange(tempValueRef.current);
            tempValueRef.current = null;
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
                    <span ref={displayElementRef} className="text-sm font-medium text-zinc-400">{value}</span>
                </div>
                <input
                    ref={inputRef}
                    id={getKey(props.label)}
                    type="range"
                    disabled={lock.isLocked}
                    min={props.min}
                    max={props.max}
                    step={props.step}
                    defaultValue={value}
                    onChange={(e) => {
                        const newValue = +e.target.value;
                        tempValueRef.current = newValue;
                        if (displayElementRef.current) {
                            displayElementRef.current.textContent = newValue.toString();
                        }
                    }}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    className="w-full text-sm font-normal"
                />
            </div>
        </RenderGuard>
    );
}

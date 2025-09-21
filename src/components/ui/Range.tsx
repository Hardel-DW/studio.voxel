import type { ComponentProps } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export type RangeProps = Omit<ComponentProps<"input">, "onChange" | "value" | "min" | "max" | "step" | "label"> & {
    value: number;
    min: number;
    max: number;
    step: number;
    onChange?: (value: number) => void;
    onChangeEnd?: (value: number) => void;
    label?: string;
};

export default function Range(props: RangeProps) {
    const tempValueRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const displayRef = useRef<HTMLSpanElement>(null);

    if (inputRef.current && tempValueRef.current === null) {
        inputRef.current.value = props.value.toString();
    }

    const handleMouseUp = () => {
        if (tempValueRef.current !== null && props.onChangeEnd) {
            props.onChangeEnd(tempValueRef.current);
            tempValueRef.current = null;
        }
    };

    return (
        <div className="relative w-full">
            {props.label && (
                <div className="flex justify-between items-center w-full mb-1">
                    <span className="block text-sm font-medium text-zinc-400">{props.label}</span>
                    <span ref={displayRef} className="text-sm font-medium text-zinc-400">
                        {props.value}
                    </span>
                </div>
            )}
            <input
                {...props}
                ref={inputRef}
                type="range"
                disabled={props.disabled}
                min={props.min}
                max={props.max}
                step={props.step}
                defaultValue={props.value}
                onChange={(e) => {
                    const newValue = +e.target.value;
                    tempValueRef.current = newValue;
                    if (displayRef.current) {
                        displayRef.current.textContent = newValue.toString();
                    }
                    props.onChange?.(newValue);
                }}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                className={cn("w-full text-sm font-normal", props.className)}
            />
        </div>
    );
}

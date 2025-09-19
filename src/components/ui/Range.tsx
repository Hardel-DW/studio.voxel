import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type RangeProps = Omit<ComponentProps<"input">, "onChange" | "value" | "min" | "max" | "step"> & {
    value: number;
    min: number;
    max: number;
    step: number;
    onChange?: (value: number) => void;
    onChangeEnd?: (value: number) => void;
    label?: string;
};

export default function Range({
    value,
    min,
    max,
    step,
    disabled = false,
    onChange,
    onChangeEnd,
    label,
    className,
    ...props
}: RangeProps) {
    const tempValueRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const displayRef = useRef<HTMLSpanElement>(null);

    if (inputRef.current && tempValueRef.current === null) {
        inputRef.current.value = value.toString();
    }

    const handleMouseUp = () => {
        if (tempValueRef.current !== null && onChangeEnd) {
            onChangeEnd(tempValueRef.current);
            tempValueRef.current = null;
        }
    };

    return (
        <div className="relative w-full">
            {label && (
                <div className="flex justify-between items-center w-full mb-1">
                    <span className="block text-sm font-medium text-zinc-400">{label}</span>
                    <span ref={displayRef} className="text-sm font-medium text-zinc-400">{value}</span>
                </div>
            )}
            <input
                ref={inputRef}
                type="range"
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                defaultValue={value}
                onChange={(e) => {
                    const newValue = +e.target.value;
                    tempValueRef.current = newValue;
                    if (displayRef.current) {
                        displayRef.current.textContent = newValue.toString();
                    }
                    onChange?.(newValue);
                }}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                className={cn("w-full text-sm font-normal", className)}
                {...props}
            />
        </div>
    );
}
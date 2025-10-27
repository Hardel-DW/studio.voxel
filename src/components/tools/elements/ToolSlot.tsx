import type { TranslateTextType } from "@/components/ui/Translate";
import Translate from "@/components/ui/Translate";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { cn } from "@/lib/utils";

export type ToolSlotType = BaseInteractiveComponent & {
    description?: TranslateTextType;
    title: TranslateTextType;
    image: string;
    size?: number;
    align?: "left" | "center" | "right";
    onBeforeChange?: () => void;
};

export default function ToolSlot(props: ToolSlotType & { index?: number }) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolSlotType, boolean>({ component: props });
    if (value === null) return null;

    const handleClick = () => {
        props.onBeforeChange?.();
        handleChange(!value);
    };

    return (
        <button
            type="button"
            className={cn(
                "bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 select-none cursor-pointer relative transition-all hover:ring-1 p-6 rounded-xl",
                { "bg-zinc-950/25 ring-1 ring-zinc-600": value },
                { "opacity-50 ring-1 ring-zinc-700": lock.isLocked }
            )}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClick();
            }}
            tabIndex={0}>
            {value && !lock.isLocked && (
                <div className="absolute p-4 top-0 right-0">
                    <img src="/icons/check.svg" alt="checkbox" className="w-6 h-6 invert" />
                </div>
            )}

            {lock.isLocked && (
                <div className="absolute p-4 top-0 right-0">
                    <img src="/icons/tools/lock.svg" alt="checkbox" className="w-6 h-6 invert" />
                </div>
            )}

            {lock.isLocked && (
                <span className="absolute p-4 bottom-0 right-0 text-xs text-zinc-400 font-light">
                    <Translate content={lock.text} />
                </span>
            )}

            <div className="flex flex-col items-center justify-between h-full">
                <div
                    className={cn(
                        "mb-8 w-full",
                        { "text-left px-4": props.align === "left" },
                        { "text-center px-4": props.align === "center" },
                        { "text-right px-4": props.align === "right" }
                    )}>
                    <h3 className="text-lg font-semibold mb-1">
                        <Translate content={props.title} />
                    </h3>
                    {props.description && (
                        <p className="text-sm text-zinc-400">
                            <Translate content={props.description} />
                        </p>
                    )}
                </div>

                <img
                    src={props.image}
                    alt={props.title.toString()}
                    className="mb-8 pixelated"
                    style={{
                        height: props.size ? `${props.size}px` : "64px"
                    }}
                />
            </div>
            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </button>
    );
}

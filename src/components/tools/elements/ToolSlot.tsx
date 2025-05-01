import { cn } from "@/lib/utils";
import type { ToolSlotType } from "@voxelio/breeze/core";
import { getKey } from "@voxelio/breeze";
import type { InteractiveComponentProps } from "./InteractiveComponent";
import Translate from "@/components/tools/Translate";

export default function ToolSlot({ component, interactiveProps }: InteractiveComponentProps<boolean, ToolSlotType>) {
    const { value, lock, handleChange } = interactiveProps;

    return (
        <div
            className={cn(
                "bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 select-none cursor-pointer relative transition-all hover:ring-1 p-6 rounded-xl",
                { "bg-zinc-950/25 ring-1 ring-zinc-600": value },
                { "opacity-50 ring-1 ring-zinc-700": lock.isLocked }
            )}
            onClick={() => handleChange(!value)}
            onKeyDown={() => handleChange(!value)}>
            {value && (
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
                    <Translate content={lock.text} schema={true} />
                </span>
            )}

            <div className="flex flex-col items-center justify-between h-full">
                <div className="mb-8 text-center">
                    <h3 className="text-lg font-semibold mb-1">
                        <Translate content={component.title} schema={true} />
                    </h3>
                    {component.description && (
                        <p className="text-sm text-zinc-400">
                            <Translate content={component.description} schema={true} />
                        </p>
                    )}
                </div>

                <img
                    src={component.image}
                    alt={getKey(component.title)}
                    className="mb-8 pixelated"
                    style={{
                        height: component.size ? component.size : "64px"
                    }}
                />
            </div>
            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}
